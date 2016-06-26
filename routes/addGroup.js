var mongoClient = require('../database/mongoClient.js');
var randomGenerator = require('../database/randomGenerator.js')
var mongoURL = "mongodb://localhost:27017/DCDS";

var insertGroup = function (db, groupData, callBackFromGroup) {
    db.collection('Groups').insert(groupData, callBackFromGroup);
}

var updateCommunity = function (db, groupData, callback) {
    var sufferingName = groupData.sufferingName;
    console.log('The suffering for the group is ' + sufferingName);
    db.collection('Communities').update({"sufferingName": sufferingName}, {$addToSet: {"groups": groupData}}, callback);
}


var standardValidation = function (req) {
    return req.body && req.body.groupName && req.body.sufferingName;
}

function deleteUsersAttribute(myGroupData) {
    delete myGroupData.users;
}
var updateIntoUsers = function (db, groupData, callBackFromUser) {
    var creatorId = groupData.creatorId;
    var myGroupData = groupData;
    deleteUsersAttribute(myGroupData);
    console.log('The id of creator is  ' + creatorId);
    db.collection('All_Users').update({"_id":creatorId},{$addToSet: {"groups":myGroupData}},callBackFromUser);

}

exports.addNewGroup = function (req, res) {
    //1st chk if already existing username//NEED TO DO EVENTUALLY------EVENTUALLYYYYYYY

    if (standardValidation(req)) {
        var groupData = req.body;
        randomGenerator.assignUniqueId(groupData);
        mongoClient.connect(mongoURL, function (err, db) {

            var callBackFromGroup = function (err, result) {
                if (err) {
                    console.log('Couldnt connect to MONGODB while inserting Group');
                    res.send({"status": "Invalid", "reason": "NO Connection TO MONGODB"});
                } else {
                    console.log('number of rows inserted in Group ' + result.insertedCount);
                    updateCommunity(db, groupData, callBackFromCommunity);

                }
            }



            var callBackFromUser = function(err,result) {
                if (err) {
                    console.log('Couldnt connect to MONGODB while updating Community');
                    res.send({"status": "Invalid", "reason": "NO Connection TO MONGODB"});
                }
                else {
                    console.log('number of rows updated in User ' + result.nUpdated);
                    res.send({"status":"Valid"});
                }
            }

            var callBackFromCommunity = function (err, result) {
                if (err) {
                    console.log('Couldnt connect to MONGODB while updating All_users');
                    res.send({"status": "Invalid", "reason": "NO Connection TO MONGODB"});
                }
                else {
                    console.log('number of rows updated in Community ' + result.nUpdated);
                    updateIntoUsers(db, groupData, callBackFromUser);
                }

            }
            if (err) {
                console.log('Couldnt connect to MONGODB');
                res.send({"status": "Invalid"});
            } else {
                insertGroup(db,groupData,callBackFromGroup);

            }
        });
        console.log('the user ' + req.body.name + ' is registered');
    }
    else {
        res.send({"status": "Invalid", "reason": "Please provide full details"});
    }
}
