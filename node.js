var http=require('http'),fs=require('fs')
,root=__dirname
,exts={
  js:'application/javascript',
  zip:'application/zip',
  html:'text/html',
}
,app=(req,res)=>{
  var p=req.url.slice(0,(req.url.indexOf('?')+1||1/0)-1)
  ,e=exts[p.slice(p.lastIndexOf('.')+1)];
  if(p==='/'){
    return res.writeHead(307,{
      'location':'/index.html#nlm&phys'
    }),res.end()
  }
  fs.readFile(root+p,(err,file)=>{
    if(err){
      return res.writeHead(404),res.end();
    }
    res.setHeader('content-type',e);
    res.setHeader('content-length',file.length);
    res.end(file)
  })
}

;for(var i=9000;i<9020;++i){
  // ServiceWorker 无法通过devtools快速杀掉，所以我选择直接改端口/IP 换源
  http.createServer(app).listen(i)
}

  // http.createServer((req,res)=>{
  //   req.url
  // }).listen(i)
