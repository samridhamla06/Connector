var mongoClient = require('../database/mongoClient.js');
var mongoURL = "mongodb://localhost:27017/DCDS";


var readAllGroups = function (db,sufferingName,callback) {
	console.log("Connected correctly to server.");
	db.collection('Communities').findOne({"sufferingName":sufferingName},{"groups":1,"_id":0},callback);
}

var readFromMongoDB = function (req,sufferingName,callback) {
	mongoClient.connect(mongoURL,function(err,db){
		if(err) {console.log("no connection");}
		else{
        readAllGroups(db,sufferingName,callback);//CHANGE IT TO AN EVENT IF U CAN...beautiful implementation..promise use of events
    }
});
}

exports.read = function(req,res){
	var sendResponse = function(err,result){
		if(err) {
			res.send({"status": "invalid", "reason": "couldn't connect mongodb"});
		}else {
			res.send(result);
		}
	}
    var sufferingName = req.params.sufferingName;
	console.log('The suffering Name for the user is ' + sufferingName);
	readFromMongoDB(req,sufferingName,sendResponse);
}