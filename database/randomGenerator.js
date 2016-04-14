var uuid = require('uuid');

var generate = function(){
return uuid.v4();
}

exports.assignUniqueId = function(myjson){
var randomId = generate();
myjson._id = randomId;
}
