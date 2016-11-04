var db = require('./../db');

var express = require('express');
var router = express.Router();

//index 获得轮播图
router.all('/index/get_images', function (req, res) {
    db.sql('select * from images', function(data) {
        res.json({data: data});
    });
})
//index 获得公告
router.all('/index/get_notice', function (req, res) {
    db.sql('select * from notice', function(data) {
        res.json({data: data});
    });
})
//index 获得秒杀商品
router.all('/index/get_special_goods', function (req, res) {
    var sql = 'select special_goods.id, special_goods.now_price, special_goods.src, goods_list.price from special_goods inner join goods_list on special_goods.goods_id=goods_list.id';
    db.sql(sql, function(data) {
        data.map(item => {
            item.old_price = item.price;
            delete item.price;
        });
        res.json({data: data});
    });
})

module.exports = router;
