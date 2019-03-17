var mongoose=require('mongoose');
var User=mongoose.model('User');

// 后台首页
exports.admin=function (req,res) {
    res.render('admin/index')
};
// 进入登录页面
exports.login = function(req, res) {
    res.render('admin/login');
};
// 进入注册页面
exports.register = function(req, res) {
    res.render('admin/register');
};
// post登录信息，校验
exports.checkUser = function(req, res) {
    var username=req.body.username;
    var password=req.body.password;
    var captcha=req.body.captcha;

    if(captcha!=req.session.captcha){
        console.log('captcha error');
        res.json({'status':'captcha error'});
    }else{ //验证码正确
        User.findOne({username:username},function(err,doc){
            if(err){
                console.log('error');
                res.json({'status':'error'});
            }
            else if(doc==null){
                console.log('not exist');
                res.json({'status':'not exist'});
            }else if(doc.status==='0'){
                //如果是刚注册的用户，还未授权无法登陆。
                console.log('unchecked');
                res.json({'status':'unchecked'});
            }else if(doc.password===password){
                console.log('success');
                //登录成功，将user保存到session中
                req.session.user = doc;
                res.json({'status':'success'});
            }else{
                console.log('password error');
                res.json({'status':'password error'});
            }
        });
    }
};
//提交注册信息，实现注册校验
exports.post_register=function (req,res) {
    console.log('进入路由');
    var username=req.body.username;
    var password=req.body.password;
    var realname=req.body.realname;
    var cellphone=req.body.cellphone;
    var captcha=req.body.captcha;

    if(captcha!=req.session.captcha){
        console.log('captcha error');
        res.json({'status':'captcha error'});
    }else{//验证码正确
        var user=new User(
            {
                username:username,
                password:password,
                realname:realname,
                cellphone:cellphone,
                status:'0'
            }
        );
        User.findOne({username:username},function(err,doc){
            if(err){
                res.json({'status':'error'});
            }
            else if(doc){
                res.json({'status':'user exist'});
            }else{
                User.create(user,function(err,doc){
                    if(err){
                        res.json({'status':'error'});
                    }
                    res.json({'status':'success'});
                });
            }
        });
    }

};