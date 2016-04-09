var mongoClient = require('../database/mongoClient.js');
var mongoURL = "mongodb://localhost:27017/DCDS";


var readAllGroups = function (db,callback) {
    var collection = db.collection('Groups');
    var cursor = collection.find({},{"users":0});
    cursor.toArray(callback);
}

var readFromMongoDB = function (req,callback) {
    mongoClient.connect(mongoURL,function(err,db){
        if(err) console.log("no connection");
        readAllGroups(db,callback);//CHANGE IT TO AN EVENT IF U CAN...beautiful implementation..promise use of events
        console.log("Connected correctly to server.");
    });
}

exports.read = function(req,res){
    console.log('The AUTHORIZATION HEADER IS ' + req.headers.authorization);
    if(req.body){
        //read from MongoDb
        readFromMongoDB(req,function(err,result){
            if(err) {
                res.send({"status": "invalid", "reason": "couldn't connect mongodb"});
            }else {
                res.send(result);
            }
        });
    }
    else {
        res.send({"status":"Invalid","reason":"username or password as null"});
    }
}