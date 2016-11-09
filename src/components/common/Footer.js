import React from 'react'
import ReactDOM from 'react-dom'

import NavLink from './NavLink'
import Util from './Util'

export default React.createClass({
    componentDidMount: function() {
        var type = this.props.type;

        if(type != 'common') {
            return false;
        }

        var _this = this;
        var storage = window.sessionStorage;

        var cart_count = storage && storage.getItem('cart_count');
        var user_name = storage && storage.getItem('user_name');


        if(!user_name) {
            return false;
        }

        if(cart_count) {
            this.props.cartEditCount(parseInt(cart_count));
            return false;
        }

        Util.ajax({
            url: Api['get_cart_count'],
            success: function(data) {
                _this.props.cartEditCount(parseInt(data.data.count));

                storage.setItem('cart_count', data.data.count);
            },
            error: function(data) {}
        });
    },
    //获得购物车商品数量
    getCount: function(data) {
        var count = 0;

        data.map(item => {
            count += parseInt(item.count);
        });

        return count;
    },
    addStorage: function(data){
        var storage = window.sessionStorage;
        var cart = storage && storage.getItem('cart');

        if(storage) {
            cart = cart ? JSON.parse(cart) : [];
            if(cart.some(item => {return item.goods_id == data.goods_id;})){
                cart.map(item => {
                    item.goods_id == data.goods_id ? item.count = data.count : null;
                });
            } else {
                cart.push(data);
            }
            storage.setItem('cart', JSON.stringify(cart));
        }
    },
    render: function() {
        var type = this.props.type;

        return (
            <footer className={'footer' + (type == 'address_operate' ? ' none' : '')}>
                {
                    type == 'common' ?
                    <ul className="common">
                        <li>
                            <div className="center">
                                <NavLink to="/" onlyActiveOnIndex={true}>
                                    <span className="icon icon-home"></span>
                                    <p>首页</p>
                                </NavLink>
                            </div>
                        </li>
                        <li>
                            <div className="center">
                                <NavLink to="/sort" >
                                    <span className="icon icon-sort"></span>
                                    <p>分类</p>
                                </NavLink>
                            </div>
                        </li>
                        <li>
                            <div className="center">
                                <NavLink to="/tool">
                                    <span className="icon icon-tool"></span>
                                    <p>工具箱</p>
                                </NavLink>
                            </div>
                        </li>
                        <li>
                            <div className="center">
                                <NavLink to="/cart">
                                    <span className="icon icon-cart p-r">
                                        {
                                            this.props.count ?
                                                <span className="count">{this.props.count}</span> : null
                                        }
                                    </span>
                                    <p>购物车</p>
                                </NavLink>
                            </div>
                        </li>
                        <li>
                            <div className="center">
                                <NavLink to="/my">
                                    <span className="icon icon-my"></span>
                                    <p>我的</p>
                                </NavLink>
                            </div>
                        </li>
                    </ul> : null
                }
                {
                    type == 'detail' ?
                    <ul className="detail">
                        <li className="left_footer">
                            <NavLink to="/cart">
                                <span className="icon p-r icon-add_cart">
                                    {
                                        this.props.count ? <span className="count">{this.props.count}</span> : null
                                    }
                                </span>
                                <p>购物车</p>
                            </NavLink>
                        </li>
                        <li className="right_footer" onClick={this.props.handle}>
                            加入购物车
                        </li>
                    </ul>
                    : null
                }
                {   type == 'cart' ?
                    <ul className="footer_cart">
                        <li className="left_footer">
                            <div className="choose active clearfix">
                                <span data-name="all_choose" onClick={this.props.handle}
                                      className={this.props.state.all_checked ? 'checkbox active fl' : 'checkbox fl'}></span>
                                <span className="fl">全选</span>
                                <span className="total fl">合计:</span>
                                <strong className="fl">¥ {this.props.state.total}</strong>
                            </div>
                        </li>
                        <li className="right_footer" onClick={this.props.clearing}>
                            去结算{this.props.state.checked_count == 0 ? null : '(' + this.props.state.checked_count + ')'}
                        </li>
                    </ul>
                    : null
                }
                {   type == 'clearing' ?
                    <ul className="footer_cart footer_clearing">
                        <li className="left_footer">
                            <div className="choose active clearfix">
                                <strong className="fr mr-08">
                                    合计: <span className="c-red">¥{this.props.data.total}</span>
                                </strong>
                                <span className="fr mr-02">
                                    共<span className="c-red">{this.props.data.count}</span>件
                                </span>
                            </div>
                        </li>
                        <li className="right_footer" onClick={this.props.handle}>
                            提交订单
                        </li>
                    </ul>
                    : null
                }
                {   type == 'address_list' ?
                    <div className="address_list" onClick={this.props.handle}>
                        新增收货地址
                    </div>
                    : null
                }
                {   type == 'address_operate' ?
                    <div className="address_list" onClick={this.props.handle}>
                        保存收货地址
                    </div>
                    : null
                }
            </footer>
        )
    }
})