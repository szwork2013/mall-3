import React from 'react'
import ReactDOM from 'react-dom'

import NavLink from './common/NavLink'
import Util from './common/Util'

import Header from './common/Header'

import ReactIScroll from 'react-iscroll'
var iScroll = require('iscroll');

const SecondItem = React.createClass({
	render() {
		return (
			<li className="common">
				<div className="img fl">
					<img src={Conf.IMG_PATH + this.props.data.thumb} />
				</div>
				<div className="info fl">
					<p className="title">{this.props.data.title}</p>
					<p className="belong_sort">分类:{this.props.data.goods_sort}</p>
					<p className="money_count">
						<span className="c-red">¥{this.props.data.goods_price}</span>
						<span className="fr">x{this.props.data.goods_num}</span>
					</p>
				</div>
			</li>
		)
	}
})

const FirstItem = React.createClass({
	render() {
		return (
			<div className="clearing_item">
				<div className="interval-01"></div>
				<p className="clearing_item_title">
					<span>{this.props.data.seller_name}</span>
					<span className="fr c-red">等待买家付款</span>
				</p>
				<ul>
					{
						this.props.data.goods_list.map(data => {
							return <SecondItem data={data} key={data.id} />
						})
					}
				</ul>
				<div className="common_padding total">
					共{this.props.data.count}件商品,合计: <span className="c-red">¥{this.props.data.total_money}</span>
				</div>
				<div className="common_padding order_list_operate_wrp">
					<a className="cancel" data-id={this.props.data.order_child_number} onClick={this.props.handle}>取消订单</a>
					<a className="pay" data-id={this.props.data.order_child_number} onClick={this.props.handle}>付款</a>
				</div>
			</div>
		)
	}
})

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
		return {
			list: []
		};
	},
	componentDidMount: function() {
		this.getOrderList();
		Util.setHeight();
	},
	//get 订单列表
	getOrderList: function() {
		var _this = this;
		Util.ajax({
			url: Api['order_list'],
			success: function(data) {
				_this.setState({
					list: data.data
				});
			},
			error: function(data) {}
		});
	},
	//取消订单 || 付款
	operate: function(event) {
		var _this = this,
			obj = $(event.currentTarget),
			id = obj.data('id'),
			param = {
				order_child_number: id
			};

		Util.alert({
			way: 'select',
			content: '取消订单么?',
			success: function() {
				Util.ajax({
					url: Api['cancel_order'],
					data: param,
					success: function(data) {
						Util.alert({
							content: '订单取消成功!'
						});
						_this.getOrderList();
					},
					error: function(data) {}
				});
			},
			error: function() {
				ReactDOM.unmountComponentAtNode(document.getElementById('alert'));
			}
		})
	},
	//返回
	pageUp: function(event) {
		var address_list = ReactDOM.findDOMNode(this.refs.address_list);
		$(address_list).removeClass('slide');

		setTimeout(function() {
			ReactDOM.unmountComponentAtNode(address_list);
		}, 300);

		event && Util.stop(event);
	},
	render: function(){
		return (
			<div>
				<div className="clearing order_list">
					<Header type="order_list" {...this.props} />
					<ul className="order_list_head">
						<li><NavLink to="order/all">全部</NavLink></li>
						<li><NavLink to="order/wait_pay">待付款</NavLink></li>
						<li><NavLink to="order/wait_send">待发货</NavLink></li>
						<li><NavLink to="order/wait_receive">待收货</NavLink></li>
					</ul>
					<ReactIScroll iScroll={iScroll} className="scroll_height" options={this.props.options}>
						<div>
							<div className="clearing_list">
								{
									this.state.list.map(data => {
										return <FirstItem data={data} handle={this.operate} key={data.order_child_number} />
									})
								}
							</div>
						</div>
					</ReactIScroll>
				</div>
			</div>
		)
	}
})