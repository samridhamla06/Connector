/**
 * Created by samridhamla06 on 11/03/16.
 */
var app = require (__dirname  + '/app.js');
var server = require('http').createServer(app);

server.listen(8000,function(){
    console.log('Server running at port 8000');
});

