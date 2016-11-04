import React from 'react'
import ReactDOM from 'react-dom'

import { browserHistory } from 'react-router'
import Alert from './Alert'

const Util = {};

Util.loading = function(param) {

    var littleR = param.littleR || 6;
    var value = param.value;

    var ctx = this.getContext('2d');

    this.width = value;
    this.height = value;

    var radius = 0;
    var radiusArr = [0, 45, 90, 135, 180, 225, 270, 315];

    var colorArr = ['#abf1ab', '#98ee98', '#e9fbe9', '#e1fae1', '#e9fbe9', '#d9f9d9', '#d0f8d0', '#c4f6c4'];

    function arc (radius){
        ctx.save();
        ctx.clearRect(0,0,value,value);
        ctx.translate(value/2,value/2);
        ctx.rotate(Math.PI / 180 * radius);

        for(var i=0; i<radiusArr.length; i++) {

            var cur = Math.PI / 180 * radiusArr[i];

            ctx.beginPath();
            ctx.fillStyle= colorArr[i];

            var smallR = littleR - i * 0.2;
            var r = value/2 - smallR;
            var x =  Math.cos(cur) * r;
            var y =  Math.sin(cur) * r;

            ctx.arc(x, y, smallR, 0, 2*Math.PI);

            ctx.fill();
            ctx.closePath();
        }
        ctx.restore();
    }

    function setOut() {
        setTimeout(function() {
            arc(radius);
            radius = radius + 10;
            setOut();
        }, 30);
    }
    setOut();
}

Util.back = function() {
    window.history.back();
}

Util.alert = function(param){

    param.type = param.type || 'success';
    param.way = param.way || 'hint';

    var alert_id = document.getElementById('alert');

    ReactDOM.render(<Alert data={param} />, alert_id);

    if(param.way == 'select') {
        return false;
    }

    setTimeout(function(){
        ReactDOM.unmountComponentAtNode(alert_id);
    },1000);
}

Util.setHeight = function(value) {

    var curHeight = height;
    var docs;

    if(typeof value == 'object') {
        docs = value.querySelectorAll('.scroll_height');
    } else {
        docs = document.querySelectorAll('.scroll_height');
    }

    if(value == 'pull_loading') {
        curHeight += 1 * fontNum;
    }

    for(var i= 0,len=docs.length; i<len; i++) {
        docs[i].style.height = curHeight + 'px';
    }

    return this;
}
//时间戳转字符
Util.timeToDate = function(time,degree){
    var date = new Date(time);

    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes()< 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
    var s = (date.getSeconds()< 10 ? '0'+(date.getSeconds()) : date.getSeconds());
    if(typeof degree == 'undefined'){
        return Y+M+D+h+m+s;
    }else if(degree == 2){
        return (Y+M).replace(/\-$/,'');
    }else if(degree == 3){
        return (Y+M+D).replace(/\s*$/,'');
    }else if(degree == 5){
        return Y+M+D+h+ m.replace(/:$/,'');
    }
}
//是否为空对象
Util.isEmptyObject = function(obj) {
    var t;
    for (t in obj) {
        return !1;
    }
    return !0
}
//复制对象
Util.cloneObj = function(obj) {
    var cloneObj = {};
    for(var key in obj) {
        if(typeof obj[key] == 'object') {
            cloneObj[key] = Util.cloneObj(obj[key]);
            continue;
        }
        cloneObj[key] = obj[key];
    }
    return cloneObj;

    $('#').css('disabled',true);
}
//get 位置
Util.getPosition = {
    success: function(position) {
        var url = 'http://api.map.baidu.com/geocoder/v2/';
        Util.ajax({
            url: url,
            dataType: 'jsonp',
            data: {
                ak: 'CQo7ihGENzzw61FVBYobEVTb',
                location: `${position.lng},${position.lat}`,
                output: 'json'
            },
            success: function (data) {
                var str = '';
                if(data.status != 0) {
                    str = Conf.DEFAULT_POSITION;
                } else {
                    alert(JSON.stringify(data));
                    str = `${data.result.addressComponent.province}>${data.result.addressComponent.city}>${data.result.addressComponent.district}`;
                }
                var storage = window.sessionStorage;
                storage && storage.setItem('position', str);
            },
            error: function (data) {}
        });
    },
    error: function (error) {
        var err_info = '';
        switch(error.code) {
            case error.PERMISSION_DENIED:
                err_info = "用户拒绝对获取地理位置的请求。";
                break;
            case error.POSITION_UNAVAILABLE:
                err_info = "位置信息是不可用的。";
                break;
            case error.TIMEOUT:
                err_info = "请求用户地理位置超时。";
                break;
            case error.UNKNOWN_ERROR:
                err_info = "未知错误。";
                break;
        }
    }
}

Util.timeToDate = function(time, degree, connect_str){
    var date = new Date(time);

    var Y = date.getFullYear() + connect_str;
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + 'connect_str';
    var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes()< 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
    var s = (date.getSeconds()< 10 ? '0'+(date.getSeconds()) : date.getSeconds());
    if(typeof degree == 'undefined'){
        return Y+M+D+h+m+s;
    }else if(degree == 2){
        return (Y+M).replace(/\-$/,'');
    }else if(degree == 3){
        return (Y+M+D).replace(/\s*$/,'');
    }else if(degree == 5){
        return Y+M+D+h+ m.replace(/:$/,'');
    }
}
//加法
Util.floatAdd = function(arg1, arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return (arg1*m+arg2*m)/m;
}
//减法
Util.floatSub = function(arg1, arg2){
    var r1,r2,m,n;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    //动态控制精度长度
    n=(r1>=r2)?r1:r2;
    return ((arg1*m-arg2*m)/m).toFixed(n);
}
//乘法
Util.floatMul = function(arg1,arg2){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".","")) * Number(s2.replace(".",""))/Math.pow(10,m);
}
//除法
Util.floatDiv = function(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}

    r1=Number(arg1.toString().replace(".",""));
    r2=Number(arg2.toString().replace(".",""));

    return (r1/r2) * Math.pow(10,t2-t1);
}

Util.stop = function(event) {
    event.preventDefault();
    event.stopPropagation();
}

Util.ajax = function(callback) {
    var _this = this;

    $.ajax({
        data : callback.data,
        type : 'post',
        url : callback.url,
        dataType : callback.dataType || 'json',
        async : true,
        cache : false,
        xhrFields: {
            withCredentials: typeof callback.cookie == 'undefined' ? false : callback.cookie
        },
        success : function(data){
            return callback.success && callback.success(data);
        },
        error: function(data) {

            var errorData = data.responseJSON || (data.responseText && JSON.parse(data.responseText)) || data;

            if(!errorData){
                return callback.error(errorData);
            }

            if(errorData['error_code'] == 30000) {
                browserHistory.push('/login');
                return '';
            }

            _this.alert(errorData['error_msg'], 'error');

            return callback.error(errorData);
        }
    });
}

export default Util