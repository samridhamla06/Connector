var mongoClient = require('../database/mongoClient.js');
var mongoURL = "mongodb://localhost:27017/DCDS";
var jwt = require('jsonwebtoken');
const server_key = "sjasadbhfdbadfkjmslkdaskasslksdnlksdala";
var payLoad = new Object();
var token;

var signToken = function(username,time){
    payload = {"name": username,"admin": true};
    token = jwt.sign(payLoad,server_key,{expiresIn:time});
    return token;
}

var validateCredentials = function(req,callback) {

    if(req.body && req.body.username)
     mongoClient.connect(mongoURL,function(err,db){
        if(err){
            console.log('couldnt connect to MongoDb');
        }else {
            console.log('inside else......');
            var cursor = db.collection('All_Users').find({"username": req.body.username,"password":req.body.password});
            cursor.toArray(callback);//should make another function
        }
    })

}

exports.login = function(req,res){

    validateCredentials(req,function(err){//IMP toArray() CALLBACK SENDS TWO PARAMETERS (err,record)
        if(!err){
            console.log('Valid UserName');
            signToken(req.body.username,60*60);
            console.log('the user ' + req.body.username + ' has logged in');
            res.send({"status":"Valid","token":token});
        }else {
            res.send({"status":"Invalid","reason":"username or password is invalid"});
        }
    })
}