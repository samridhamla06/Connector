var app = require (__dirname  + '/app.js');
var server = require('http').createServer(app);

server.listen(8000,function(){
    console.log('Server running at port 8000');
});

//910f67a0-fb99-4130-b792-db88a47cc8df