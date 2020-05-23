const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 5000;

const mimeTypes = {
    'html' : 'text/html',
    'css' : 'text/css',
    'js' : 'text/javascript',
    'png' : 'image/png',
    'jpeg' : 'image/jpeg',
    'jpg' : 'image/jpg',
}

http.createServer((req,res)=>{
    var myuri = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(),unescape(myuri));
    console.log(`your running file is ${fileName}`);
    var loadFile;

    try {
       loadFile = fs.lstatSync(fileName); 
    } catch (error) {
        res.writeHead(404,{'Content-Type' : 'text/html'});
        res.write('404 Error, Page Not Found');
        res.end();
        return;
    }
    if(loadFile.isFile()){
        var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        res.writeHead(200,{'Content-Type' : mimeType});
        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);

    }
    else if(loadFile.isDirectory()){
        res.writeHead(302,{'Location' : 'index.html'});
        res.end();
    }
    else{
        res.writeahead(500,{'Content-Type': 'text/html'});
        res.write('500 Error, Internal Server Error');
        res.end()
    }
    
}).listen(port,hostname,()=>{
    console.log(`your server is running on http://${hostname}:${port}`)
})