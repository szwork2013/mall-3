var Api = {

    login: 'user/login', //登录
    logout: 'user/logout', //退出
    get_code: 'user/get_code', //获取手机验证码
    register: 'user/register', //注册

    get_images: 'index/get_images', //获得轮播图
    get_notice: 'index/get_notice', //获得公告
    get_special_goods: 'index/get_special_goods', //获得秒杀商品

    get_sort_list: 'goods/get_sort_list', //获得商品分类
    get_goods_list: 'goods/get_goods_list', //获得商品列表
    get_goods_detail: 'goods/get_goods_detail', //获得商品详情
    //购物车
    add_cart: 'cart/add_cart', //添加购物车
    edit_cart: 'cart/edit_cart', //编辑购物车
    delete_cart: 'cart/delete_cart', //删除购物车
    get_cart_count: 'cart/get_cart_count', //获得购物车数量
    get_cart_list: 'cart/get_cart_list', //获得购物车列表
    go_clearing: 'cart/go_clearing', //去结算

    get_goods_comment: 'goods/get_goods_comment', //获得商品评论列表

    submit_order: 'order/submit_order', //提交订单
    order_list: 'order/order_list', //订单列表
    cancel_order: 'order/cancel_order', //取消订单

    //收货地址
    get_address_list: 'address/get_address_list', //获得地址列表
    get_default_address: 'address/get_default_address', //获得默认地址
    add_address: 'address/add_address', //添加地址

    get_area_list: 'area/get_area_list' //获得区域列表
};
for(var key in Api) {
    Api[key] = Conf.API_PATH + Api[key];
}
