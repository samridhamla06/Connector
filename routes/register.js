var mongoClient = require('../database/mongoClient.js');
var mongoURL = "mongodb://localhost:27017/DCDS";
//var mongoURL = "mongodb://localhost:27000/DCDS";



var insertUser = function(db,data,callback) {
    var collection = db.collection('All_Users');
    collection.insert(data,function(err,result){
        if(err) {
            console.log('Couldnt connect to MONGODB');
            callback(err);
             }
        else {
            console.log('number of rows inserted ' + result.insertedCount);
            callback(err);
        }
    });
}

var standardValidation = function(req){
    return req.body && req.body.name && req.body.password && req.body.username && req.body.location && req.body.suffering && req.body.currentStatus;
}

exports.register = function(req,res){
    //1st chk if already existing username//NEED TO DO EVENTUALLY------EVENTUALLYYYYYYY
    if(standardValidation(req)){
        //insert in MongoDb
        mongoClient.connect(mongoURL,function(err,db) {
            if (err) {
                console.log("no connection");
                res.send({"status": "Invalid"});
            } else {
                insertUser(db, req.body, function (err) {
                if (err) {
                    res.send({"status": "Invalid","reason":"NO Connection TO MONGODB"});
                } else {
                    res.send({"status": "Valid"});
                }
            });
        }
        });
        console.log('the user ' + req.body.name + ' is registered');
    }
    else {
        res.send({"status":"Invalid","reason":"Please provide full details"});
    }
}
