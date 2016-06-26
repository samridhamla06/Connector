
var mongoClient = require('../database/mongoClient.js');
var mongoURL = "mongodb://localhost:27017/DCDS";

var getInfoForSelectedID = function (db,userId, callback) {
    var cursor = db.collection('All_Users').find({"_id":userId},{"password":0});
    cursor.limit(1);//NEED TO CHANGE IMPLEMENTAION
    cursor.toArray(callback);
};

var readFromMongoDB = function(userId, callback) {

    mongoClient.connect(mongoURL,function(err,db){
        if(err){
            console.log('Couldnt connect to the MONGO DB server');
            callback(err);
        }else{
            getInfoForSelectedID(db,userId,callback);
        }
    });

}
exports.getUserInfo = function(req,res) {

    var sendResponse = function (err,result){
        if (err) {
            res.send({"status": "invalid", "reason": "couldn't connect mongodb/wrong url"});
        } else {
            console.log('result obtained '+ result.length);
            res.send(result);
        }
    }

    if (req.params.userId) {
        var userId = req.params.userId;
        console.log('requested_userId is ' + userId);
        readFromMongoDB(userId,sendResponse);
    }else{
        res.send({"status": "invalid", "reason": "invalid URL....go fuck yourself"});
    }
}