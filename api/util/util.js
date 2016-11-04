var crypto = require('crypto');

var Util = {
    getVal: function(req) {
        return req.method == 'GET' ? req.query : req.body;
    },
    resError: function(res, info) {
        res.status(503);
        res.json({
            error_msg: info
        });
    },
    addKey: function(value) {
        var secrectKey = '12345678';
        return crypto.createHmac('sha1', secrectKey).update(value + '').digest().toString('base64');
    },
    //是否为空对象
    isEmptyObject(obj) {
        var t;
        for (t in obj) {
            return !1;
        }
        return !0
    },
    createRandom: function(num) {
        return parseInt(Math.random() * Math.pow(10, num));
    },
    //生成订单号
    createOrderId: function(req, str) {
        str = str || '';

        var date = new Date();

        var Y = date.getFullYear() + '';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
        var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        var h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours());
        var m = (date.getMinutes()< 10 ? '0'+(date.getMinutes()) : date.getMinutes());
        var s = (date.getSeconds()< 10 ? '0'+(date.getSeconds()) : date.getSeconds());

        var returnStr = Y + M + D + h + m + s + this.createRandom(6);

        return returnStr.slice(2);
    },
    //加法
    floatAdd: function(arg1, arg2){
        var r1,r2,m;
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
        m=Math.pow(10,Math.max(r1,r2));
        return (arg1*m+arg2*m)/m;
    }
}

module.exports = Util;