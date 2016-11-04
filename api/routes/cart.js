var db = require('./../db');

var Util = require('./../util/util');

var filter = require('./../filter');

var express = require('express');
var router = express.Router();

//添加购物车
router.all('/cart/add_cart', filter.authorize, function (req, res) {

    var user_id = req.session.user_id;
    var goods_id = Util.getVal(req).goods_id;
    var count = parseInt(Util.getVal(req).count || 1);
    var goods_sort = Util.getVal(req).goods_sort;

    var search_sql = 'select * from cart where goods_id='+ goods_id+ ' and goods_sort="'+goods_sort+'"';
    var add_sql = 'insert into cart (user_id, goods_id, goods_sort, goods_num) values ('+user_id+', '+goods_id+', "'+goods_sort+'", '+count+')';

    var param = {
        user_id: user_id,
        goods_id: goods_id
    }
    db.sql(search_sql, function(data) {
        if(data.length === 0) {
            db.sql(add_sql, function(data) {
                param['id'] = data.insertId;
                param['count'] = count;
                res.json({
                    request_id: 12345,
                    data: param
                });
            })
        } else {
            count = parseInt(data[0].goods_num)+count;

            var update_sql = 'update cart set goods_num='+count+' where goods_id='+goods_id;

            param['id'] = data.id;
            param['count'] = count;

            db.sql(update_sql, function(data) {
                res.json({
                    request_id: 12345,
                    data: param
                });
            })
        }
    });
})
//编辑购物车
router.all('/cart/edit_cart', filter.authorize,  function (req, res) {
    var id = req.session.user_id;
    var type = Util.getVal(req).type;

    var sql = 'update cart set goods_num=goods_num'+(type == 'up' ? '+' : '-')+'1 where id='+ id;
    db.sql(sql, function(data) {
        res.json({
            request_id: 12345
        });
    });
})
//删除购物车
router.all('/cart/delete_cart', filter.authorize, function (req, res) {

    var user_id = req.session.user_id;
    var id = Util.getVal(req).id;

    var delete_sql = 'delete from cart where id='+ id;

    db.sql(delete_sql, function(data) {
        res.json({
            request_id: 12345
        });
    });
})
//get购物车数量
router.all('/cart/get_cart_count', filter.authorize, function (req, res) {

    var user_id = req.session.user_id;
    var sql = 'select goods_num from cart where user_id='+user_id;

    db.sql(sql, function(data) {
        var count = 0;
        data.map(item => {
            count += item.goods_num;
        })
        res.json({data: {
            count: count
        }});
    });
})
//购物车列表
router.all('/cart/get_cart_list', filter.authorize, function (req, res) {

    var user_id = req.session.user_id;
    var sql = 'select cart.id, cart.goods_id, cart.goods_sort, cart.goods_num, goods_list.title, goods_list.price, goods_list.thumb from cart inner join goods_list on cart.goods_id=goods_list.id where cart.user_id='+user_id;

    db.sql(sql, function(data) {
        data.forEach(item => {
            item.count = item.goods_num;
            delete item.goods_num;
        })
        res.json({data: data});
    });
})
//去结算
router.all('/cart/go_clearing', filter.authorize, function (req, res) {

    var param = JSON.parse(Util.getVal(req).data);

    var sql = 'select cart.id, cart.goods_id, cart.goods_sort, goods_list.seller_id, goods_list.seller_name, goods_list.title, goods_list.price from cart inner join goods_list on cart.goods_id=goods_list.id where ';

    for(var key in param) {
        sql += ('cart.id=' + key + ' or ');
    }

    sql = sql.slice(0, -4);

    db.sql(sql, function(data) {

        var save = {},
            lastArr = [];

        data.map(function(item) {

            var id = item.seller_id;
            item.count = param[item.id];

            if(typeof save[id] == 'undefined'){
                save[id] = {
                    seller_id: item.seller_id,
                    seller_name: item.seller_name,
                    goods_list: [item],
                    count: item.count,
                    total: item.price * item.count
                };
                delete item.seller_id;
                delete item.seller_name;

                return true;
            }

            delete item.seller_id;
            delete item.seller_name;

            save[id].count += item.count;
            save[id].total += item.price * item.count;
            save[id].goods_list.push(item);
        });

        for(var key in save) {
            lastArr.push(save[key]);
        }

        res.json({data: lastArr});
    });
})
module.exports = router;
