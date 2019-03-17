var Admin  = require('../controller/admin/admin')

module.exports = function(app) {
    //跳转到登录页面
    app.get('/login',Admin.login);
    //跳转到登录页面
    app.get('/register',Admin.register);
    // 后台首页
    app.get('/admin', Admin.admin);

    //提交登录信息，实现登录信息校验
    app.post('/login',Admin.checkUser);
    //提交注册信息，实现注册校验
    app.post('/register',Admin.post_register);
    //用户登出操作
    // app.get('/logout',Admin.logout);
    //给新注册的用户授权
    // app.post('/authorize',Admin.authorize);

};
