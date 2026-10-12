const DemoStore={db:null,ready:false,
 async connect(){if(this.db)return this.db;return new Promise((ok,no)=>{const r=indexedDB.open('zharovnya-test-v3',1);r.onupgradeneeded=()=>r.result.createObjectStore('state');r.onerror=()=>no(r.error);r.onsuccess=()=>{this.db=r.result;ok(this.db);};});},
 async load(){const db=await this.connect();return new Promise((ok,no)=>{const r=db.transaction('state').objectStore('state').get('demo');r.onsuccess=()=>{this.ready=true;ok(r.result);};r.onerror=()=>no(r.error);});},
 async save(v){if(!this.ready)return;try{const db=await this.connect();db.transaction('state','readwrite').objectStore('state').put(JSON.parse(JSON.stringify(v)),'demo');}catch{}},
 async clear(){const db=await this.connect();this.ready=false;return new Promise((ok,no)=>{const tx=db.transaction('state','readwrite');tx.objectStore('state').clear();tx.oncomplete=ok;tx.onerror=()=>no(tx.error);});}
};
if('serviceWorker' in navigator&&location.hostname!=='localhost'&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
