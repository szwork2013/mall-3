import React from 'react'

import Util from './Util'
import NavLink from './NavLink'

export default React.createClass({
    getInitialState: function () {
        let data = {};
        return data;
    },
    componentDidMount: function() {},
    render: function() {
        var storage = window.sessionStorage;
        var user_name = storage && storage.getItem('user_name');

        var type = this.props.type || 'default';
        return (
            <header className="header">
                {
                    type == 'login' ?
                        <div className="common_box">
                            <div className="code">
                                <NavLink to="index">
                                    <span className="icon_common icon-arrow_left"></span>
                                </NavLink>
                            </div>
                            <div className="hint_title">
                                登录
                            </div>
                        </div>
                        : null
                }
                {
                    type == 'register' ?
                        <div className="common_box">
                            <div className="code">
                                <span className="icon_common icon-arrow_left" onClick={Util.back}></span>
                            </div>
                            <div className="hint_title">
                                注册
                            </div>
                        </div>
                        : null
                }
                {
                    type == 'order_list' ?
                        <div className="common_box">
                            <div className="code">
                                <NavLink to="/my">
                                    <span className="icon_common icon-arrow_left" onClick={Util.back}></span>
                                </NavLink>
                            </div>
                            <div className="hint_title">
                                订单管理
                            </div>
                        </div>
                        : null
                }
                {
                    type == 'detail' ?
                    <div className="common_box">
                        <div className="code" onClick={Util.back}>
                            <span className="icon_common icon-arrow_left"></span>
                        </div>
                        <ul className="detail_title clearfix">
                            <li><a>商品</a></li>
                            <li><a className="active">详情</a></li>
                            <li><a>评价</a></li>
                        </ul>
                        <div className="news fr">
                            <span className="icon icon-my"></span>
                        </div>
                    </div>
                    : null
                }
                {
                    type == 'tool' ?
                        <div className="common_box">
                            <div className="hint_title">
                                工具箱
                            </div>
                        </div>
                        : null
                }
                {
                    type == 'cart' ?
                        <div className="common_box">
                            <div className="hint_title">
                                购物车
                            </div>
                        </div>
                        : null
                }
                {
                    type == 'address_list' || type == 'address_operate' ?
                        <div className="common_box">
                            <div className="code">
                                <span onClick={this.props.pageUp} className="icon_common icon-arrow_left"></span>
                            </div>
                            <div className="hint_title">
                                管理收货地址
                            </div>
                        </div>
                        : null
                }
                {
                    type == 'clearing' ?
                        <div className="common_box">
                            <div className="code">
                                <span onClick={this.props.pageUp} className="icon_common icon-arrow_left"></span>
                            </div>
                            <div className="hint_title">
                                确认订单
                            </div>
                        </div>
                        : null
                }
                {
                    type != 'order_list' && type != 'register' && type != 'login' && type != 'address_operate' && type != 'address_list' && type != 'detail' && type != 'cart' && type != 'tool' && type != 'clearing' ?
                    <div className="common_box">
                        <div className="code" onClick={ type == 'goods_list' ? Util.back : null}>
                            {type == 'goods_list' ? <span className="icon_common icon-arrow_left"></span> : 'jd'}
                        </div>
                        <div className="search">
                            <span className="icon_common icon-search"></span>
                            <input className="search_input" placeholder="手表每满500减100" />
                        </div>
                        <div className="news">
                            <NavLink to={user_name ? 'my' : 'login'}>{user_name ? <span className="head_user"></span> : '登录'}</NavLink>
                        </div>
                    </div>
                    : null
                }
                {
                    type == 'goods_list' ?
                    <ul className="condition clearfix">
                        <li className="active" onClick={this.props.handle}>
                            <a>综合</a>
                        </li>
                        <li onClick={this.props.handle}>
                            <a>销量</a>
                        </li>
                        <li onClick={this.props.handle}>
                            <a>价格</a>
                        </li>
                        <li onClick={this.props.handle}>
                            <a>筛选</a>
                        </li>
                    </ul> : null
                }
            </header>
        )
    }
})