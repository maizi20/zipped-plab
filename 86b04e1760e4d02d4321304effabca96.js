self.document&&(document.body.innerText='loaded.');
safariWDNMD();
var _debug=!0,req=fetch,PostMessage=e=>{
  'function'===typeof postMessage?postMessage(e):clients.matchAll({includeUncontrolled:!0}).then(a=>a.map(w=>w.postMessage(e)))
},local,url=new URL(location),scope=new URL('/nlc/',location)
  //new URL(url.searchParams.get('p')||'./',url)
,onunhandledrejection=e=>{
  self.document?document.body.append(e.reason+''):PostMessage((e=e&&e.reason)&&{
    action:'showError',
    stack:e.reason.stack,name:e.reason.name,error:e.reason,
    trace:new Error('trace').stack
  },'*')
}
,onfetch=e=>e.respondWith(req(e.request,e))
,oninstall=e=>e.waitUntil(done)
,onmessage=e=>{
  var m=e.data,p;
  switch(m.action){
    case'port_proxy':
      require(['proxy'],p=>p.connect(m));break;
    case'ping':
      e.source.postMessage({
        action:'pong',id:m.id,data:m.data,tr:m.tr
      },'*',[m.tr]);break;
    case'sw_ready':
      location=m.url;break;
  }
}
,onactivate=e=>{
  e.waitUntil;
  PostMessage({action:'sw_ready',url:''+new URL('page/readme_cn/index.html',scope)});
}
,done='function'===typeof importScripts?caches.open('local').then(async c=>{
  await(local=c).match(new URL('js/lib/define.js',scope)).then(r=>r.text()).then(eval);
  await local.match(new URL('js/lib/lib.js',scope)).then(r=>r.text()).then(eval);
  Reflect.construct(AMD,[],function g(){
    if(!new.target)return g.prototype={
      $local:()=>caches.open('local'),
      $fetch:()=>r=>fetch(r.url,r),
      $temp:()=>caches.open('temp'),
      $img_cache:()=>caches.open('img_cache'),
      $jszip$cache_script:s=>s('js/lib/jszip.min.js'),
      $json5$cache_script:s=>s('js/lib/json5.min.js'),
      $crypto_js$cache_script:s=>s('js/lib/crypto_js.min.js'),
      $cache_script$local:c=>u=>c.match(u=new URL(u,scope))
      .then(r=>r||fetch(u).then(r=>c.put(u,r.clone()).then(()=>r)))
      .then(r=>r.text()).then(t=>(
        (t+='\n;0//#_source'+'URL='+u,eval)(t),AMD.require([AMD.current],n=>n)
      )),
      $user:()=>({}),
      $setting$local:c=>c.match(new URL('page/info/settings.json',scope)).then(r=>r.json()),
      $workspace_reflect$local:c=>c.match(new URL('assets/json/workspace_reflect.json',scope)).then(r=>r.json())
        .then(o=>(o.mapping=new Map(o.reflect.map(e=>[e.i,e])),o)),
      $init$lpromise$cache_script:(P,s)=>P.all([
        'js/sw/api.js',
        'js/sw/content.js',
        'js/sw/local.js',
        'js/sw/proxy.js',
        'js/sw/req.js',
        'js/sw/main.js',
      ].map(u=>s(u))),
      $promise:()=>Promise
    },g
  }());
  return AMD.require(['init','main'])
}).then(()=>{
  console.log('sw: done');
  // clients.claim().then(()=>clients.matchAll({includeUncontrolled:!0})).then(a=>Promise.all(a.map(w=>w.postMessage({action:'sw_ready',url:''+new URL('page/readme_cn/index.html',scope)}))));
}):(async c=>{
  log('opening CacheStorage...');
  c=await caches.open('local')
  errorPort.onmessage=e=>{
    var n=document.createElement('code');
    n.innerText=n.value=JSON.stringify(e),document.body.appendChild(n)
  }
  if(c==null||'function'!==typeof c.match){
    console.warn('safari wdnmd');
    log('reopening CacheStorage...');
    for(var t=Date.now();Date.now()-t<1e4&&!c;)
      c=await caches.open('local');
    if(!c)throw document.body.append(t=new Error(`CacheStorage is not support.(caches.open('local') resolve ${c})`)),t;
  }if(await c.match(u=new URL('page/format/check.html',scope))){
    console.log(navigator.serviceWorker.controller,u);
    log('waiting ServiceWorker activate...');
    var f=document.createElement('iframe'),c=0,s=setInterval(()=>++c>20?(clearInterval(s),log('ServiceWorker timeout.')):f.src=u+'?t='+c,200),u;
    f.src=u,document.body.append(f);
  }else{
    console.log(navigator.serviceWorker.controller,u);
    log('download assets...');
    var b=await fetch('/user_projects_backpack/'+Array.from(hash,n=>'0123456789abcdef'[n>>4]).join('')+'.zip').then(r=>r.arrayBuffer())
    ,t=new TextDecoder().decode(new Uint8Array(b,new Uint8Array(b).indexOf(74)-5,102329)),w,z;
    ('function'===typeof relEval?relEval:eval)(t+'\n;console.log("jszip")');
    log('decode assets...');
    z=await JSZip.loadAsync(b);
    z.file(new URL('lib/js/zip.min.js',scope).href,t);
    await Promise.all(Object.entries(z.files).map(({0:p,1:f})=>f.async('uint8array').then(
      b=>f.dir&&!b.length||c.put(p=new URL(p,scope),new Response(b,{headers:{
        'content-type':f.comment,
        'content-length':b.length,
        'last-modified':f.date.toUTCString(),
        'location':p.href,
        'x-hash-crc32':f.crc32||''
      }}))
    )));
    log('wait ServiceWorker activate.');
  }
  new BroadcastChannel('activate').onmessage=e=>location.reload();
  w=navigator.serviceWorker;
  w.controller||await w.register('/w.js?s=/'+Array.from(hash,n=>'0123456789abcdef'[n&15]).join('')+'.js&p='+scope,{scope});
  function log(msg){
    var n=document.createElement('h5');
    n.innerText=msg,document.body.appendChild(n);
  }
})();
async function safariWDNMD(){
  'function'===typeof relEval&&(eval.call=(g,t)=>relEval(t));
  'function'===typeof importScripts||import('/vconsole.js').then(()=>new VConsole);
  errorPort=new BroadcastChannel('sw_error');
  caches.open=async function(){
    for(var r,c=0;++c<50;await new Promise(r=>setTimeout(r,100)))
      if(r=await CacheStorage.prototype.open.apply(this,arguments))return r;
    throw new Error(`can't open the cache ${arguments[0]}.`);
  }
}

