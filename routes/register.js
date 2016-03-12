var mongoClient = require('../database/mongoClient.js');
var mongoURL = "mongodb://localhost:27017/DCDS";
//var mongoURL = "mongodb://localhost:27000/DCDS";


var insertUser = function(db,data,callback) {
    var collection = db.collection('All_Users');
    collection.insert(data,function(err,result){
        if(err) {
            console.log('Couldnt insert');
        }
        else {
            console.log('number of rows inserted ' + result.insertedCount);
            callback(err);
        }
    });
}

var standardValidation = function(req){
    return req.body && req.body.username && req.body.password;
}
exports.register = function(req,res){
    //1st chk if already existing username//NEED TO DO EVENTUALLY
    if(standardValidation(req)){
        //insert in MongoDb
        mongoClient.connect(mongoURL,function(err,db) {
            if (err) {
                console.log("no connection");
                res.send({"status": "Invalid"});
            } else {
                insertUser(db, req.body, function (err) {
                if (err) {
                    res.send({"status": "Invalid","reason":"Couldnt insert"});
                } else {
                    res.send({"status": "Valid"});
                }
            });
        }
        });
        console.log('the user ' + req.body.username + ' is regstd');
    }
    else {
        res.send({"status":"Invalid","reason":"username or password as null"});
    }
}
