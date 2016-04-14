  var mongoClient = require('../database/mongoClient.js');
  var randomGenerator =require('../database/randomGenerator.js')
  var mongoURL = "mongodb://localhost:27017/DCDS";

  var insertGroup = function(db,groupData,callback) {
    db.collection('Groups').insert(groupData,callback);
  }

  var updateCommunity = function(db,groupData,callback) {
    var sufferingName = groupData.sufferingName;
    console.log('The suffering for the group is ' + sufferingName);
    db.collection('Communities').update({"sufferingName":sufferingName},{$addToSet:{"groups":groupData}},callback);
  }


  var standardValidation = function(req){
    return req.body && req.body.groupName && req.body.sufferingName;
  }

  exports.addNewGroup = function(req,res){
      //1st chk if already existing username//NEED TO DO EVENTUALLY------EVENTUALLYYYYYYY

      if(standardValidation(req)){
        var groupData = req.body;
        randomGenerator.assignUniqueId(groupData);
        mongoClient.connect(mongoURL,function(err,db) {

          var sendFinalResponse = function(err,result){
            if(err){
             console.log('Couldnt connect to MONGODB while updating Community');
             res.send({"status": "Invalid","reason":"NO Connection TO MONGODB"});
           }
           else {
            console.log('number of rows updated in Community' + result.count);
            res.send({"status": "Valid"});};}

          var updateIntoCommunities = function (err,result) {
          if (err) {
            console.log('Couldnt connect to MONGODB while inserting Group');
            res.send({"status": "Invalid","reason":"NO Connection TO MONGODB"});
          } else {
            console.log('number of rows inserted ' + result.insertedCount);
            updateCommunity(db,groupData,sendFinalResponse);
          }}

          if (err) {
            console.log('Couldnt connect to MONGODB');
            res.send({"status": "Invalid"});
          } else {
            insertGroup(db, groupData, updateIntoCommunities);
          }
        });
  console.log('the user ' + req.body.name + ' is registered');
}
else {
  res.send({"status":"Invalid","reason":"Please provide full details"});
}
}
