var app = require (__dirname  + '/app.js');
var server = require('http').createServer(app);

server.listen(8000,function(){
    console.log('Server running at port 8000');
});