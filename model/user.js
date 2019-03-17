var mongoose=require('mongoose');

var  userschema=new mongoose.Schema({
    username:String,
    password:String,
    realname:String,
    cellphone:String,
    status:String
});

mongoose.model('User',userschema);