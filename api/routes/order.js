var db = require('./../db');

var Util = require('./../util/util');

var filter = require('./../filter');

var express = require('express');
var router = express.Router();

//提交订单
router.all('/order/submit_order', filter.authorize, function (req, res) {

    var user_id = req.session.user_id;
    var data = JSON.parse(Util.getVal(req).data);
    var address_id = Util.getVal(req).address_id;
    var count = Util.getVal(req).count;
    var total = Util.getVal(req).total;

    var cartIdStr = '';

    var returnSql = function(data, type) {

        var table_name = '';

        if(type == 1) {
            table_name = 'user_order_table';
        }

        var keyStr = '',
            valueStr = '';

        for(var key in data) {
            keyStr += (key + ',');
            valueStr += (data[key] + ',');
        }
        keyStr = keyStr.slice(0, -1);
        valueStr = valueStr.slice(0, -1);

        var returnStr = `INSERT INTO ${table_name} (${keyStr}) VALUES (${valueStr})`;

        return returnStr;
    };

    var order_number = Util.createOrderId();

    var insertMainOrder = new Promise(function(resolve) {
        db.sql(returnSql({
            order_number: order_number,
            user_id: user_id,
            order_date: Date.now(),
            count: count,
            total_money: total,
            order_address_id: address_id
        }, 1), function (data, err) {
            resolve(data);
        })
    });

    var insertChildOrder = new Promise(function(resolve) {

        var valueStr = '';

        data.forEach(item => {

            var order_id = Util.createOrderId();
            item.order_id = order_id;

            valueStr += `(${order_number}, ${order_id}, ${item.seller_id}, "${item.seller_name}", ${item.count}, ${item.total}, "${item.comment || ''}"),`;
        });

        valueStr = valueStr.slice(0, -1);

        var sql_str = `INSERT INTO user_child_order_table (order_number, order_child_number, seller_id, seller_name, count, total_money, comment) VALUES ${valueStr}`;

        db.sql(sql_str, function (data, err) {
            resolve(data);
        });
    });

    var insertOrderGoods = new Promise(function(resolve) {

        var sql_Str = 'select cart.id, cart.goods_id, cart.goods_sort,' +
        'cart.goods_num, goods_list.price from cart inner join goods_list on cart.goods_id=goods_list.id where ';

        data.forEach(item => {
            item.goods_list.forEach(goodsItem => {
                cartIdStr += `cart.id=${goodsItem.id} or `;
            });
        });
        cartIdStr = cartIdStr.slice(0, -4);

        sql_Str += cartIdStr;

        console.log(sql_Str);

        db.sql(sql_Str, function (goodsdata) {

            var saveGoods = {};
            console.log(goodsdata);

            goodsdata.forEach(item => {
                saveGoods[item.id] = item;
            });

            data.forEach(item => {
                item.goods_list.forEach(goodsItem => {
                    goodsItem.goods_info = saveGoods[goodsItem.id];
                });
            });

            var valueStr = '';

            data.forEach(item => {
                item.goods_list.forEach(goodsItem => {
                    valueStr += `(${item.order_id}, ${goodsItem.goods_info.goods_id}, ${goodsItem.goods_info.goods_num}, "${goodsItem.goods_info.goods_sort}", "${goodsItem.goods_info.price}"),`;
                });
            });

            valueStr = valueStr.slice(0, -1);

            var sql_str = `INSERT INTO user_order_goods (order_child_number, goods_id, goods_num, goods_sort, goods_price) VALUES ${valueStr}`;

            db.sql(sql_str, function (data, err) {
                resolve(data);
            })
        });
    });

    Promise.all([insertMainOrder, insertChildOrder, insertOrderGoods]).then(function(result) {

        var sql_delete = `delete from cart where ${cartIdStr}`;

        console.log(sql_delete);
        db.sql(sql_delete, function (data) {});

        res.json({
            info: '订单提交成功!'
        })
    });
});
//订单列表
router.all('/order/order_list', filter.authorize, function (req, res) {

    var user_id = req.session.user_id,
        status = Util.getVal(req).status || 1;

    var sql_parent = `select order_number from user_order_table where user_id=${user_id}`;

    var sql_child = `select order_number,order_child_number,seller_id,seller_name,count,total_money,comment from user_child_order_table where order_status=${status} and `;

    var sql_goods = `select user_order_goods.id, user_order_goods.order_child_number, user_order_goods.goods_id, user_order_goods.goods_num, user_order_goods.goods_sort, user_order_goods.goods_price, goods_list.title, goods_list.thumb from user_order_goods inner join goods_list on user_order_goods.goods_id=goods_list.id where `;

    db.sql(sql_parent, function(data) {

        if(data.length == 0) {
            res.json({data: []});
            return false;
        }

        var numberStr = '';

        data.forEach(item => {
            numberStr += `order_number=${item.order_number} or `;
        });
        numberStr = numberStr.slice(0, -4);

        sql_child += `(${numberStr})`;

        console.log(sql_child);

        db.sql(sql_child, function(childData) {

            if(childData.length == 0) {
                res.json({data: []});
                return false;
            }

            var numberStr = '';

            childData.forEach(item => {
                numberStr += `order_child_number=${item.order_child_number} or `;
            });
            numberStr = numberStr.slice(0, -4);

            sql_goods += numberStr;

            db.sql(sql_goods, function(goodsData) {

                childData.forEach(childItem => {
                    var saveGoodsList = [];

                    goodsData.forEach(goodsItem => {
                        if(goodsItem.order_child_number == childItem.order_child_number) {
                            saveGoodsList.push(goodsItem);
                        }
                    });
                    childItem.goods_list = saveGoodsList;
                });
                res.json({data: childData});
            })
        })
    })
});
//取消订单
router.all('/order/cancel_order', filter.authorize, function (req, res) {

    var user_id = req.session.user_id;
    var order_child_number = Util.getVal(req).order_child_number;

    var sql_update = `update user_child_order_table set order_status=${0} where order_child_number=${order_child_number}`;

    db.sql(sql_update, function(data) {
        res.json({
            request_id: 123456
        });
    });
})

module.exports = router;
