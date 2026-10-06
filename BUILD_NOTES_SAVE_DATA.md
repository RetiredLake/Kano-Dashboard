Save Data and Load Data appear above Reset Experience with download/upload glyphs.
JSON backups include all localStorage and sessionStorage program/progress entries,
Story Mode save cookies (read through a same-origin /story/ bridge), and complete
IndexedDB databases including Minecraft IDBFS binary world files and timestamps.
Authentication cookies are excluded. Load validates before writing, overwrites all
existing saved data, and attempts rollback on write errors. Close other Kano tabs
before restoring so their live app instances cannot rewrite old saves.

Validated: TypeScript check and production build; backup round trip with both
programs and binary world files; deletion of newer programs/worlds absent from the
backup; scoped cookie preservation; invalid-file preservation; binary/date codec.
