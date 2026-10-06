// Full browser-local app backup, including Emscripten IDBFS world files.
type Encoded = null | boolean | number | string | { type: string; value?: any; name?: string };
type Store = { name: string; keyPath: string | string[] | null; autoIncrement: boolean; indexes: { name: string; keyPath: string | string[]; unique: boolean; multiEntry: boolean }[]; records: { key: Encoded; value: Encoded }[] };
type Backup = { format: "kano-save-data"; version: 1; localStorage: [string, string][]; sessionStorage: [string, string][]; storyCookies: [string, string][]; databases: { name: string; version: number; stores: Store[] }[] };

function base64(bytes: Uint8Array) {
  let text = "";
  for (let i = 0; i < bytes.length; i += 32768) text += String.fromCharCode(...bytes.subarray(i, i + 32768));
  return btoa(text);
}
function bytes(text: string) { return Uint8Array.from(atob(text), c => c.charCodeAt(0)); }
export async function encode(value: any): Promise<Encoded> {
  if (value === undefined) return { type: "undefined" };
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : { type: "number", value: String(value) };
  if (value instanceof Date) return { type: "date", value: value.toISOString() };
  if (value instanceof ArrayBuffer) return { type: "buffer", value: base64(new Uint8Array(value)) };
  if (ArrayBuffer.isView(value)) return { type: "typed", name: value.constructor.name, value: base64(new Uint8Array(value.buffer, value.byteOffset, value.byteLength)) };
  if (value instanceof Blob) return { type: "blob", name: value.type, value: base64(new Uint8Array(await value.arrayBuffer())) };
  if (Array.isArray(value)) return { type: "array", value: await Promise.all(value.map(encode)) };
  if (typeof value === "object") return { type: "object", value: await Promise.all(Object.entries(value).map(async ([k, v]) => [k, await encode(v)])) };
  throw new Error("Unsupported saved data type.");
}
export function decode(value: Encoded): any {
  if (value === null || typeof value !== "object") return value;
  switch (value.type) {
    case "undefined": return undefined;
    case "number": return Number(value.value);
    case "date": return new Date(value.value);
    case "buffer": return bytes(value.value).buffer;
    case "blob": return new Blob([bytes(value.value).buffer as ArrayBuffer], { type: value.name });
    case "typed": {
      const constructors = { Uint8Array, Uint8ClampedArray, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array, DataView };
      const Constructor = constructors[value.name as keyof typeof constructors];
      if (!Constructor) throw new Error("Invalid binary data.");
      return Reflect.construct(Constructor, [bytes(value.value).buffer]);
    }
    case "array": return value.value.map(decode);
    case "object": return Object.fromEntries(value.value.map(([k, v]: [string, Encoded]) => [k, decode(v)]));
    default: throw new Error("Invalid saved data.");
  }
}
function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => { req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); });
}
function complete(tx: IDBTransaction) {
  return new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onerror = tx.onabort = () => reject(tx.error || new Error("Could not write saved data.")); });
}
async function storyDocument() {
  const iframe = document.createElement("iframe"); iframe.hidden = true;
  iframe.src = "/story/data-bridge.html";
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => { iframe.remove(); reject(new Error("Could not access Story Mode saves.")); }, 10000);
    iframe.onload = () => { clearTimeout(timer); resolve(); };
    iframe.onerror = () => { clearTimeout(timer); iframe.remove(); reject(new Error("Could not access Story Mode saves.")); };
    document.body.appendChild(iframe);
  });
  if (!iframe.contentDocument) { iframe.remove(); throw new Error("Could not access Story Mode saves."); }
  return iframe;
}
async function cookies(replacement?: [string, string][]) {
  const iframe = await storyDocument();
  try {
    const doc = iframe.contentDocument!;
    const current = doc.cookie.split(";").flatMap(item => {
      const split = item.trim().indexOf("="); const name = item.trim().slice(0, split);
      return /^kano_story_v1_(manifest|chunk_\d+)$/.test(name) ? [[name, item.trim().slice(split + 1)] as [string, string]] : [];
    });
    if (replacement) {
      const suffix = `; Path=/story/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
      for (const [name] of current) doc.cookie = `${name}=; Max-Age=0${suffix}`;
      for (const [name, value] of replacement) doc.cookie = `${name}=${value}; Max-Age=31536000${suffix}`;
    }
    return current;
  } finally { iframe.remove(); }
}
function storageEntries(storage: Storage): [string, string][] { return Object.keys(storage).map(key => [key, storage.getItem(key)!]); }
export async function captureData(): Promise<Backup> {
  if (typeof indexedDB.databases !== "function") throw new Error("This browser cannot export all saved data.");
  const backup: Backup = { format: "kano-save-data", version: 1, localStorage: storageEntries(localStorage), sessionStorage: storageEntries(sessionStorage), storyCookies: await cookies(), databases: [] };
  for (const { name } of await indexedDB.databases()) {
    if (!name) continue;
    const db = await request(indexedDB.open(name));
    try {
      const stores: Store[] = [];
      const raw: { store: Store; keys: IDBValidKey[]; values: any[] }[] = [];
      if (db.objectStoreNames.length) {
        const tx = db.transaction(Array.from(db.objectStoreNames), "readonly"); const done = complete(tx);
        const pending = Array.from(db.objectStoreNames).map(async name => {
          const store = tx.objectStore(name);
          const snapshot: Store = { name, keyPath: store.keyPath, autoIncrement: store.autoIncrement, indexes: Array.from(store.indexNames).map(name => {
            const index = store.index(name); return { name, keyPath: index.keyPath, unique: index.unique, multiEntry: index.multiEntry };
          }), records: [] };
          const [keys, values] = await Promise.all([request(store.getAllKeys()), request(store.getAll())]);
          return { store: snapshot, keys, values };
        });
        raw.push(...await Promise.all(pending)); await done;
      }
      for (const { store, keys, values } of raw) {
        store.records = await Promise.all(keys.map(async (key, i) => ({ key: await encode(key), value: await encode(values[i]) })));
        stores.push(store);
      }
      backup.databases.push({ name, version: db.version, stores });
    } finally { db.close(); }
  }
  return backup;
}
export function validateBackup(input: any): asserts input is Backup {
  if (!input || input.format !== "kano-save-data" || input.version !== 1) throw new Error("Choose a Kano Save Data JSON file.");
  const pairs = (entries: any) => Array.isArray(entries) && entries.every((entry: any) => Array.isArray(entry) && entry.length === 2 && entry.every((v: any) => typeof v === "string"));
  if (!pairs(input.localStorage) || !pairs(input.sessionStorage) || !pairs(input.storyCookies) || !input.storyCookies.every(([name, value]: string[]) => /^kano_story_v1_(manifest|chunk_\d+)$/.test(name) && !/[;\r\n]/.test(value)) || !Array.isArray(input.databases)) throw new Error("Invalid Kano backup.");
  const names = new Set();
  for (const db of input.databases) {
    if (!db || typeof db.name !== "string" || !db.name || names.has(db.name) || !Number.isSafeInteger(db.version) || db.version < 1 || !Array.isArray(db.stores)) throw new Error("Invalid database backup.");
    names.add(db.name);
    const stores = new Set();
    const keyPath = (v: any) => typeof v === "string" || (Array.isArray(v) && v.every(k => typeof k === "string"));
    for (const store of db.stores) {
      if (!store || typeof store.name !== "string" || stores.has(store.name) || (store.keyPath !== null && !keyPath(store.keyPath)) || typeof store.autoIncrement !== "boolean" || !Array.isArray(store.indexes) || !Array.isArray(store.records)) throw new Error("Invalid store backup.");
      stores.add(store.name);
      for (const index of store.indexes) if (!index || typeof index.name !== "string" || !keyPath(index.keyPath) || typeof index.unique !== "boolean" || typeof index.multiEntry !== "boolean") throw new Error("Invalid index backup.");
      for (const record of store.records) { indexedDB.cmp(decode(record.key), decode(record.key)); decode(record.value); }
    }
  }
}
async function applyData(backup: Backup) {
  for (const { name } of await indexedDB.databases()) {
    if (!name) continue;
    const req = indexedDB.deleteDatabase(name);
    await new Promise<void>((resolve, reject) => { req.onsuccess = () => resolve(); req.onerror = () => reject(req.error); req.onblocked = () => reject(new Error("Close other Kano tabs before loading data.")); });
  }
  for (const snapshot of backup.databases) {
    const req = indexedDB.open(snapshot.name, snapshot.version);
    req.onupgradeneeded = () => {
      for (const store of snapshot.stores) {
        const created = req.result.createObjectStore(store.name, { keyPath: store.keyPath, autoIncrement: store.autoIncrement });
        for (const index of store.indexes) created.createIndex(index.name, index.keyPath, { unique: index.unique, multiEntry: index.multiEntry });
      }
    };
    const db = await request(req);
    try {
      if (!snapshot.stores.length) continue;
      const tx = db.transaction(snapshot.stores.map(s => s.name), "readwrite"); const done = complete(tx);
      for (const store of snapshot.stores) for (const record of store.records) {
        const target = tx.objectStore(store.name);
        if (store.keyPath === null) target.put(decode(record.value), decode(record.key));
        else target.put(decode(record.value));
      }
      await done;
    } finally { db.close(); }
  }
  localStorage.clear(); sessionStorage.clear();
  for (const [key, value] of backup.localStorage) localStorage.setItem(key, value);
  for (const [key, value] of backup.sessionStorage) sessionStorage.setItem(key, value);
  await cookies(backup.storyCookies);
}
export async function saveData() {
  const backup = await captureData();
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup)], { type: "application/json" }));
  const link = document.createElement("a"); link.href = url; link.download = `kano-save-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
}
export async function loadData(file: File) {
  const backup = JSON.parse(await file.text()); validateBackup(backup);
  const previous = await captureData();
  try { await applyData(backup); }
  catch (error) {
    try { await applyData(previous); } catch { throw new Error("Restore failed. Keep your backup and close other Kano tabs before retrying."); }
    throw error;
  }
}
