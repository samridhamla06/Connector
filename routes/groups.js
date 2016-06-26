var mongoClient = require('../database/mongoClient.js');
var mongoURL = "mongodb://localhost:27017/DCDS";


var getNearByGroups = function (db, sufferingName, coordinates, callbackFromGroup) {
    console.log('value of coordinates '+ JSON.stringify(coordinates));
    db.collection('Groups').find({
        "sufferingName": sufferingName,
        "loc": {$near: {$geometry: {type: "Point", coordinates: coordinates}, $minDistance: 0, $maxDistance: 100000}}
    },{"users":0,"loc":0}).toArray(callbackFromGroup);
}

var getCoordinates = function (db, userId, callBackFromUser) {
    db.collection('All_Users').findOne({"_id": userId}, {"loc": 1, "_id": 0}, callBackFromUser);//WILL BE USED LATER
}

function setUpMongoDbConnection(callback) {
    mongoClient.connect(mongoURL, callback);
}

var isNotNull = function (userId) {
    console.log('userId ' + userId + ' wants to retrieve his/her groups')
    return userId != null;
};

exports.readMyGroups = function (req, res) {
    var userId = req.params.userId;

    var callBackFromUser = function (err, result) {
        if (err) {
            console.log('error while reading my groups');
            res.send({"status": "Invalid", "reason": "couldn't connect mongodb"});
        } else {
            res.send(result.groups);

        }

    };

    setUpMongoDbConnection(function (err, db) {
        if (err) {
            console.log("no connection");
            res.send({"status": "Invalid", "reason": "couldn't connect mongodb"});
        }
        else {
            if (isNotNull(userId)) {
                db.collection('All_Users').findOne({"_id": userId}, {"_id": 0, "groups": 1}, callBackFromUser);
            } else {
                res.send({"status": "Invalid", "reason": "userId not present in URL"});
            }
        }
    })
}

exports.readGroups = function (req, res) {
    setUpMongoDbConnection(function (err, db) {
        if (err) {
            console.log("no connection");
            res.send({"status": "Invalid", "reason": "couldn't connect mongodb"});
        }
        else {
            var sufferingName = req.params.sufferingName;
            var userId = req.params.userId;
            console.log('The suffering Name for the user is ' + sufferingName);
            //FUNCTIONS
            var callbackFromGroup = function (err, result) {//-------------------------------------SEND RESPONSE
                if (err) {
                    res.send({"status": "Invalid", "reason": "couldn't connect mongodb"});
                } else {
                    console.log('the result obtained for near by groups ' + JSON.stringify(result) );
                    res.send(result);
                }
            }


            var callbackFromUser = function (err, result) {//-------------------------------------SEND RESPONSE
                if (err) {
                    res.send({"status": "Invalid", "reason": "couldn't connect mongodb"});
                } else {
                    console.log('the result is ' + JSON.stringify(result) );
                    if(result != null){
                        var coordinates = result.loc.coordinates;
                        getNearByGroups(db, sufferingName,coordinates, callbackFromGroup);
                    }else{
                        res.send({"status": "Invalid", "reason": "user ID is inValid"});
                    }
                }
            }

            getCoordinates(db,userId,callbackFromUser);
        }
    });

}