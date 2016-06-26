  var mongoClient = require('../database/mongoClient.js');
  var mongoURL = "mongodb://localhost:27017/DCDS";


  var updateCommunity = function(db,groupId,userData) {
    var sufferingName = userData.sufferingName;
    console.log('The suffering for the user is ' + sufferingName);
    db.collection('Communities').update({"sufferingName":sufferingName},{$addToSet:{"users":userData}},function(err,result){
    if(err){
    console.log('the user ' + userData.email + ' couldnt be added to community due to connectivity issue ');
    }
    });
  }

  var nullifyAdditionalFields = function(userData){
       delete userData.token;
       delete userData.status;
  }

  var insertUserIntoGroup = function(db,userData,groupId,callback){
  var email = userData.email;
  nullifyAdditionalFields(userData);
  db.collection('Groups').update({"_id":groupId},{$addToSet:{"users":userData}},callback);
  console.log('User The group with id added into Group' + groupId);
  updateCommunity(db,groupId,userData);
 }


  var standardValidation = function(req){
    //NEED TO CHANGE //return req.body && req.body.userName && req.body.userId && req.body.sufferingName && req.body.location && req.body.email && req.params.gid;
    return true;
  }

  exports.joinGroup = function(req,res){
    var sendResponse = function(err,result){
    if(err){
        console.log('Couldnt connect to mongoDB');
        res.send({"status":"InValid","reason":"Coundnt connect to mongoDB"});
    }
    else{
    res.send({"status": "Valid"});
    }
}

console.log('user ' + req.body.userName + ' trying to join group ' + req.params.gid);

    if(standardValidation(req)){
    var userData = req.body;
    var groupId = req.params.gid;

    mongoClient.connect(mongoURL,function(err,db){
    if(err){
    console.log('Couldnt connect to mongoDB');
    res.send({"status":"InValid","reason":"Coundnt connect to mongoDB"});
    }else{
        insertUserIntoGroup(db,userData,groupId,sendResponse);
    }
});
}
    else {
      res.send({"status":"Invalid","reason":"Please provide full details"});
    }
  }
