var mongoClient = require('../database/mongoClient.js');
var mongoURL = "mongodb://localhost:27017/DCDS";
var randomGenerator = require('../database/randomGenerator.js')


var insertUser = function (db, userData, callback) {
    db.collection('All_Users').insert(userData, callback);
}

var updateCommunity = function (db, userData, callback) {
    var sufferingName = userData.sufferingName;
    console.log('The suffering for the user is ' + sufferingName);
    db.collection('Communities').update({"sufferingName": sufferingName}, {$addToSet: {"users": userData}}, callback);
}

var standardValidation = function (req) {
    return req.body && req.body.email && req.body.password && req.body.userName && req.body.location && req.body.sufferingName && req.body.currentStatus;
}


exports.register = function (req, res) {
    //1st chk if already existing username//NEED TO DO EVENTUALLY------EVENTUALLYYYYYYY

    if (standardValidation(req)) {
        var userData = req.body;
        randomGenerator.assignUniqueId(userData);
        mongoClient.connect(mongoURL, function (err, db) {

          var sendFinalResponse = function (err, result) {
                if (err) {
                    console.log('Couldnt connect to MONGODB while updating Community');
                    res.send({"status": "Invalid", "reason": "NO Connection TO MONGODB"});
                }
                else {
                    res.send({"status": "Valid"});
                }
            }

            var sendResponse = function (err, result) {
                if (err) {
                    console.log('Couldnt connect to MONGODB while inserting User');
                    res.send({"status": "Invalid", "reason": "NO Connection TO MONGODB"});
                } else {
                    console.log('number of rows inserted ' + result.insertedCount);
                    updateCommunity(db, userData, sendFinalResponse);
                }
            }

            if (err) {
                console.log('Couldnt connect to MONGODB');
                res.send({"status": "Invalid"});
            } else {
                insertUser(db, userData, sendResponse);
            }

        });
        console.log('the user ' + req.body.userName + ' is registered');
    }
    else {
        res.send({"status": "Invalid", "reason": "Please provide full details"});
    }



}
