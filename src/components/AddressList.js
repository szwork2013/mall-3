import React from 'react'
import ReactDOM from 'react-dom'

import Util from './common/Util'

import AddressOperate from './AddressOperate'
import Header from './common/Header'
import Footer from './common/Footer'

import ReactIScroll from 'react-iscroll'
var iScroll = require('iscroll');

const Item = React.createClass({
	render() {
		return (
			<li className={this.props.data.is_default == 1 ? 'address active' : 'address'} onClick={this.props.handle} data-id={this.props.data.id}>
				<div className="address_name">
					<span>收货人:{this.props.data.receive_name}</span>
					<span className="fr">{this.props.data.receive_phone}</span>
				</div>
				<div className="address_content p-r">
					<p>收货地址: {this.props.data.province_name + this.props.data.city_name + (this.props.data.area_name ? this.props.data.area_name : '') + this.props.data.address}</p>
				</div>
				{
					this.props.data.is_default == 1 ?
					<div className="right_icons">
						<span className="glyphicon glyphicon-ok"></span>
					</div> : null
				}
			</li>
		)
	}
})

const List = React.createClass({
	getInitialState: function () {
		return {
			list: []
		}
	},
	componentDidMount() {
		this.getList();
		Util.setHeight();
	},
	getList: function() {
		var _this = this;
		Util.ajax({
			url: Api['get_address_list'],
			success: function(data) {
				_this.setState({
					list: data.data
				});
			},
			error: function(data) {}
		});
	},
	getDefaultProps: function() {
		return ({
			options: {
				mouseWheel: true,
				click: true
			}
		})
	},
	//选择地址
	chooseAddress: function(event) {
		var obj = $(event.currentTarget);
		var id = obj.data('id'),
			list = this.state.list,
			data = {};

		list.map(item => {
			if(item.id == id) {
				data = item;
			}
		});

		this.props.chooseAddress(data);
		Util.stop(event);
	},
	//添加地址 || 编辑地址
	operateAddress(event) {
		var address_operate = ReactDOM.findDOMNode(this.refs.address_operate);

		ReactDOM.render(<AddressOperate pageUp={this.pageUp} />, address_operate);
		$(address_operate).addClass('slide');

		Util.stop(event);
	},
	pageUp: function(event) {
		var address_operate = ReactDOM.findDOMNode(this.refs.address_operate);
		$(address_operate).removeClass('slide');

		setTimeout(function() {
			ReactDOM.unmountComponentAtNode(address_operate);
		}, 300);

		if(typeof event == 'string' && event == 'refresh') {
			this.getList();
			return false;
		}
		event && Util.stop(event);
	},
	render(){

		return (
			<div>
				<div className="address_list">
					<Header type="address_list" {...this.props} />
					<ReactIScroll iScroll={iScroll} className="scroll_height" options={this.props.options}>
						<ul className="common_padding_top">
							{
								this.state.list.map(data => {

									return <Item handle={this.chooseAddress} data={data} key={data.id} />
								})
							}
						</ul>
					</ReactIScroll>
					<Footer type="address_list" handle={this.operateAddress} />
				</div>
				<div ref="address_operate" className="common_wrp address_operate_wrp"></div>
			</div>
		)
	}
})

export default List