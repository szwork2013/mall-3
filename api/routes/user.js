var db = require('./../db');

var Util = require('./../util/util');

var request = require('request');

var express = require('express');
var router = express.Router();

//登录
router.all('/user/login', function (req, res) {

    var name = Util.getVal(req).name;
    var password = Util.getVal(req).password;

    password = Util.addKey(password);

    db.sql(`select * from user where name="${name}" or phone="${name}"`, function (data) {

        var info = '';
        if (!data[0]) {
            info = '用户不存在!'
        } else if (data[0].password != password) {
            info = '密码错误!'
        } else {
            req.session.user_id = data[0].id;
            res.json({
                request_id: 123456
            });
            return '';
        }
        res.status(503);
        res.json({error_msg: info});
    });
})
//退出
router.all('/user/logout', function (req, res) {
    req.session.destroy();
    res.json({
        request_id: 123456
    });
})
//get 手机验证码
router.all('/user/get_code', function (req, res) {

    var account = 'chujian0719',
        password = 'yangdong0719',
        phone = Util.getVal(req).phone,
        code = '';

    db.sql(`select * from user where phone="${phone}"`, function (data) {

        var info = '';
        if (data[0]) {
            info = '手机号已注册!';
            Util.resError(res, info);
            return '';
        }

        for (var i = 0; i < 6; i++) {
            code += Math.floor(Math.random() * 10);
        }

        req.session.code = code;

        var content = `您的验证码是：${code}。请不要把验证码泄露给其他人。如非本人操作，可不用理会！`;
        content = encodeURIComponent(content);

        var url = `http://sms.106jiekou.com/utf8/sms.aspx?account=${account}&password=${password}&mobile=${phone}&content=${content}`;

        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200 && body == 100) {
                res.json({
                    data: {
                        info: '短信发送成功!'
                    }
                });
            } else {
                Util.resError(res, '短信发送失败!');
            }
        })
    });
})
//注册
router.all('/user/register', function (req, res) {

    var phone = Util.getVal(req).phone;
    var name = Util.getVal(req).name;
    var code = Util.getVal(req).code;
    var password = Util.getVal(req).password;

    password = Util.addKey(password);

    if (code != req.session.code) {
        Util.resError(res, '验证码错误!');
        return '';
    }

    db.sql(`select * from user where name="${name}"`, function (data) {

        var info = '';

        if (data[0]) {
            info = '用户名已存在!';
            Util.resError(res, info);
            return '';
        }

        db.sql(`insert into user (phone,name,password) value (${phone},'${name}',"${password}")`, function (data) {
            req.session.user_id = data.insertId;
            res.json({
                data: {
                    phone: phone
                }
            });
        });
    })
})

module.exports = router;
