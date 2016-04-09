
var mongoClient = require('../database/mongoClient.js');
var mongoURL = "mongodb://localhost:27017/DCDS";


var getListOfUsers = function(gid,db, callback){

    console.log('in getListOFUsers '+ gid);

    var collection = db.collection('Groups');
    var cursor = collection.find({'gid':gid},{'users':1,'_id':0});
    cursor.toArray(callback);
}
var readFromMongoDB = function(gid,callback){
    mongoClient.connect(mongoURL,function(err,db){
        if(err) {
            console.log("no connection");
            callback(err);
        }
        console.log('in readfrommongodb '+ gid);
        getListOfUsers(gid,db,callback);//CHANGE IT TO AN EVENT IF U CAN...beautiful implementation..promise use of events
        console.log("Connected correctly to server.");
    });
}


exports.retrieveUsers = function(req,res) {


    if (req.params.gid) {
        var gid = parseInt(req.params.gid);
        console.log('requested_gid is ' + gid);
        //var gid = 1;
        readFromMongoDB(gid, function (err, result) {
            if (err) {
                res.send({"status": "invalid", "reason": "couldn't connect mongodb/wrong url"});
            } else {
                console.log('result obtained '+ result.length);
                res.send(result);
            }
        });
    }else{
        res.send({"status": "invalid", "reason": "invalid URL"});
    }
}


