var mongoClient = require('../database/mongoClient.js');
var mongoURL = "mongodb://localhost:27017/DCDS";
var jwt = require('jsonwebtoken');
const server_key = "sjasadbhfdbadfkjmslkdaskasslksdnlksdala";
var payLoad = new Object();
var token;

var signToken = function(username,time,suffering,name){
  payload = {"username": username,"admin": true,"suffering":suffering,"name":name};
  token = jwt.sign(payLoad,server_key,{expiresIn:time});
  return token;
}

var validateCredentials = function(username,password,callback) {
  mongoClient.connect(mongoURL,function(err,db){
    if(err){
      console.log('couldnt connect to MongoDb');
            callback(err,null);//as the END USER SHOULD BE NOTIFIED ABOUT THIS
          }else {
            console.log('GOT CONNECTED TO MONGODB');
            var collection = db.collection('All_Users')
            collection.findOne({"username": username,"password":password},callback);//can add function
          }
        })

}

exports.login = function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  console.log(username + ' trying to log in');

var sendResponse = function(err,record){
   if(!err && record){//-------------------------------------------FOUND THE MATCHING RECORD
   console.log('Valid UserName with name : '+ record.username + ' And suffering is '+ record.suffering );
   var suffering = record.suffering;//-----------------------------RETRIEVING suffering TO ADD LATER ON IN TOKEN PAYLOAD
   var username =  record.username;
   var name = record.name;
   var expiryTime = 60*60;


   signToken(username,expiryTime,suffering,name);
   console.log('the user ' + username + ' has logged in');
   res.send({"status":"Valid","token":token,"suffering":suffering,"username":username,"name":name});
 }else {
   console.log('Invalid UserName');
   res.send({"status":"Invalid","token":null,"reason":"Invalid Username/Password"});
 }
}


if(username && password){
    validateCredentials(username,password,sendResponse)
  }else{
    res.send({"status":"Invalid","token":null,"reason":"UserName or Password is Null"});
  }
}