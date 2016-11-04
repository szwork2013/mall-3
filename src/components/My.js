import React from 'react'

import Footer from './common/Footer'
import Util from './common/Util'
import NavLink from './common/NavLink'

import ReactIScroll from 'react-iscroll'
var iScroll = require('iscroll');

export default React.createClass({
	getDefaultProps: function() {
		return ({
			options: {
				mouseWheel: true,
				click: true
			}
		})
	},
	getInitialState: function () {
		return {}
	},
	componentDidMount: function() {
		this.props.changeFooterShowStatus();

		Util.setHeight();
	},
	logout: function(event) {
		Util.ajax({
			url: Api['logout'],
			success: function(data) {
				window.location.href = '/#login';
			},
			error: function(data) {}
		});
		Util.stop(event);
	},
	render: function(){

		var user_name = storage && storage.getItem('user_name');

		return (
			<div className="my">
				<ReactIScroll iScroll={iScroll} className="scroll_height" options={this.props.options}>
					<div>
						<header className="p-r">
							<div className="header_img"></div>
							<div className="my_info">
								<span className="my_img fl">
									<img src="images/defaul.png" />
								</span>
								<div className="my_person_info p-r">
									<p>502751002</p>
									<p>钻石会员</p>
									<div className="head_message">
										<span>账户管理、收货地址</span>
									</div>
								</div>
							</div>
						</header>
						<div className="my_order">
							<div className="my_title">
								<strong>我的订单</strong>
								<span className="fr">
									<span className="fl">全部订单</span>
									<span className="arrow"></span>
								</span>
							</div>
							<ul className="my_content clearfix">
								<li>
									<NavLink to="order/wait_pay">
										<span className="my_icon icon-wait_pay"></span>
										<p>待付款</p>
									</NavLink>
								</li>
								<li>
									<NavLink to="order/wait_pay">
										<span className="my_icon icon-wait_receive"></span>
										<p>待收货</p>
									</NavLink>
								</li>
								<li>
									<NavLink to="order/wait_pay">
										<span className="my_icon icon-problem"></span>
										<p>返修退货</p>
									</NavLink>
								</li>
							</ul>
						</div>
						<div className="my_money">
							<div className="my_title">
								<strong>我的资产</strong>
								<span className="arrow"></span>
							</div>
							<ul className="my_content clearfix">
								<li>
									<p>0.00</p>
									<p>购物币</p>
								</li>
								<li>
									<p>0.00</p>
									<p>购物金</p>
								</li>
								<li>
									<p>0.00</p>
									<p>购物补贴</p>
								</li>
							</ul>
						</div>
						<div className="other_list">
							<ul>
								<li>
									<span>流水记录</span>
									<span className="arrow"></span>
								</li>
								<li>
									<span>我的关注</span>
									<span className="arrow"></span>
								</li>
								<li>
									<span>意见反馈</span>
									<span className="arrow"></span>
								</li>
								<li>
									<span>更多</span>
									<span className="arrow"></span>
								</li>
							</ul>
						</div>
						<div className="logout_wrp" onClick={this.logout}>
							<a className="logout">退  出</a>
						</div>
					</div>
				</ReactIScroll>
			</div>
		)
	}
})