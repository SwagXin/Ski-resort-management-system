var mongoose=require('mongoose');
// var config=require('./db_url.js');
mongoose.Promise = global.Promise;
module.exports=function(){
    var db=mongoose.connect('mongodb://localhost/ski',{useMongoClient:true});
    require('../model/user.js');
    return db;
};