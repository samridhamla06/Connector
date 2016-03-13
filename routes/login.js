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
            callback(err,null);//as the END USER SHOULD BE NOTIFIED ABOUT THIS
        }else {
            console.log('GOT CONNECTED TO MONGODB');
            var cursor = db.collection('All_Users').find({"username": req.body.username,"password":req.body.password});
            //cursor.limit(1);
            cursor.toArray(callback);//should make another function
        }
    })

}

exports.login = function(req,res){
    console.log(req.body.username + ' tryin to log in');    //TENTATIVE########********^^^^^^@@@@@@@

    validateCredentials(req,function(err,record){//IMP toArray() CALLBACK SENDS TWO PARAMETERS (err,record)
        console.log('No of records with '  + req.body.username +' is ' + record.length);
        if(!err && record &&record.length > 0){//CAN CREATE A FUNCTION for THIS
            console.log('Valid UserName');
            signToken(req.body.username,60*60);
            console.log('the user ' + req.body.username + ' has logged in');
            res.send({"status":"Valid","token":token});
        }else {
            res.send({"status":"Invalid","token":null,"reason":null});
        }
    })
}