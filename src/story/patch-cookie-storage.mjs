import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const source = process.argv[2] || fileURLToPath(new URL("./love.js", import.meta.url));
const output = process.argv[3] || fileURLToPath(new URL("../../public/story/love.js", import.meta.url));
const original = await readFile(source, "utf8");
const marker = "KANO_COOKIE_SAVE_V1";

const oldStorage = 'FS.mount(IDBFS,{},"/home/web_user/love");FS.syncfs(true,function(err){if(err){Module["printErr"](err)}else{Module.removeRunDependency("IDBFS_sync")}});window.addEventListener("beforeunload",function(event){FS.syncfs(false,function(err){if(err){Module["printErr"](err)}})})';

const replacement = `FS.mount(IDBFS,{},"/home/web_user/love");
var ${marker}=(function(){
  var root="/home/web_user/love";
  var manifestName="kano_story_v1_manifest";
  var chunkPrefix="kano_story_v1_chunk_";
  var chunkSize=3000;
  var maxBytes=32000;
  var saveTimer=null;

  function secureSuffix(){return window.location.protocol==="https:"?"; Secure":""}
  function setCookie(name,value,maxAge){document.cookie=name+"="+value+"; Path=/story/; Max-Age="+maxAge+"; SameSite=Lax"+secureSuffix()}
  function deleteCookie(name){setCookie(name,"",0)}
  function readCookie(name){
    var prefix=name+"=";
    var values=document.cookie?document.cookie.split(";"):[];
    for(var i=0;i<values.length;i++){
      var value=values[i].trim();
      if(value.indexOf(prefix)===0)return value.slice(prefix.length);
    }
    return null;
  }
  function checksum(value){
    var hash=2166136261;
    for(var i=0;i<value.length;i++){hash^=value.charCodeAt(i);hash=Math.imul(hash,16777619)}
    return (hash>>>0).toString(16);
  }
  function toBase64(bytes){
    var binary="";
    for(var i=0;i<bytes.length;i+=0x8000){binary+=String.fromCharCode.apply(null,bytes.subarray(i,i+0x8000))}
    return btoa(binary);
  }
  function fromBase64(value){
    var binary=atob(value);
    var bytes=new Uint8Array(binary.length);
    for(var i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    return bytes;
  }
  function collectFiles(directory,files){
    var names=FS.readdir(directory);
    for(var i=0;i<names.length;i++){
      var name=names[i];
      if(name==="."||name==="..")continue;
      var filePath=directory+"/"+name;
      var stat=FS.stat(filePath);
      if(FS.isDir(stat.mode))collectFiles(filePath,files);
      else if(FS.isFile(stat.mode))files.push({path:filePath,data:FS.readFile(filePath)});
    }
  }
  function readSavedFiles(){
    try{
      var manifest=readCookie(manifestName);
      if(!manifest)return null;
      var fields=manifest.split(":");
      var count=Number(fields[1]);
      if(fields.length!==3||fields[0]!=="1"||!Number.isInteger(count)||count<1||count>12)return null;
      var encoded="";
      for(var i=0;i<count;i++){
        var chunk=readCookie(chunkPrefix+i);
        if(chunk===null)return null;
        encoded+=chunk;
        if(encoded.length>maxBytes)return null;
      }
      if(checksum(encoded)!==fields[2])return null;
      var payload=JSON.parse(new TextDecoder("utf-8").decode(fromBase64(encoded)));
      if(!payload||payload.version!==1||!Array.isArray(payload.files))return null;
      return payload.files;
    }catch(error){Module["printErr"]("Could not read Story Mode cookie save: "+error)}
    return null;
  }
  function clearStoredFiles(){
    var files=[];
    collectFiles(root,files);
    for(var i=0;i<files.length;i++)FS.unlink(files[i].path);
  }
  function restoreSavedFiles(files){
    clearStoredFiles();
    for(var i=0;i<files.length;i++){
      var file=files[i];
      if(!file||typeof file.path!=="string"||file.path.indexOf(root+"/")!==0||file.path.indexOf("/../")!==-1||typeof file.data!=="string")continue;
      var parent=file.path.slice(0,file.path.lastIndexOf("/"));
      if(parent!==root)FS.mkdirTree(parent);
      FS.writeFile(file.path,fromBase64(file.data));
    }
  }
  function writeSavedFiles(){
    try{
      var files=[];
      collectFiles(root,files);
      if(!files.length)return;
      files.sort(function(a,b){return a.path.localeCompare(b.path)});
      var payload={version:1,files:files.map(function(file){return {path:file.path,data:toBase64(file.data)}})};
      var bytes=new TextEncoder().encode(JSON.stringify(payload));
      var encoded=toBase64(bytes);
      if(encoded.length>maxBytes){Module["printErr"]("Story Mode save is too large for cookie storage; keeping the IndexedDB copy.");return}
      var count=Math.ceil(encoded.length/chunkSize);
      for(var i=0;i<count;i++)setCookie(chunkPrefix+i,encoded.slice(i*chunkSize,(i+1)*chunkSize),31536000);
      setCookie(manifestName,"1:"+count+":"+checksum(encoded),31536000);
      for(var stale=count;stale<12;stale++)deleteCookie(chunkPrefix+stale);
    }catch(error){Module["printErr"]("Could not save Story Mode to cookies: "+error)}
  }
  function persist(){
    writeSavedFiles();
    FS.syncfs(false,function(error){if(error)Module["printErr"](error)});
  }
  function initialize(){
    FS.syncfs(true,function(error){
      if(error)Module["printErr"](error);
      try{
        var saved=readSavedFiles();
        if(saved)restoreSavedFiles(saved);
        else writeSavedFiles();
      }catch(restoreError){Module["printErr"]("Could not restore Story Mode cookie save: "+restoreError)}
      Module.removeRunDependency("IDBFS_sync");
      if(!saveTimer)saveTimer=window.setInterval(writeSavedFiles,1500);
    });
  }
  window.addEventListener("beforeunload",persist);
  window.addEventListener("pagehide",persist);
  document.addEventListener("visibilitychange",function(){if(document.visibilityState==="hidden")persist()});
  return {initialize:initialize};
})();
${marker}.initialize();`;

let patched = original;
if (!original.includes(marker)) {
  const count = original.split(oldStorage).length - 1;
  if (count !== 1) {
    throw new Error(`Expected one IndexedDB initialization block, found ${count}`);
  }
  patched = original.replace(oldStorage, replacement);
}

await writeFile(output, patched);
console.log(`Cookie storage ready: ${path.resolve(output)}`);
