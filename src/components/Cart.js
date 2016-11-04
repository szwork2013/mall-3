import React from 'react'
import ReactDOM from 'react-dom'

import Util from './common/Util'

import Detail from './Detail'
import Clearing from './Clearing'

import Header from './common/Header'
import Footer from './common/Footer'

import Loading from './Loading'

import ReactIScroll from 'react-iscroll'
var iScroll = require('iscroll');

export default React.createClass({
	page:{},
	getInitialState: function () {
		return {
			list: [],
			total: 0,
			checked_count: 0,
			all_checked: false
		};
	},
	componentDidMount: function() {
		this.props.changeFooterShowStatus();

		this.getList();
		Util.setHeight('clearing');
	},
	//获得购物车列表
	getList: function() {
		var _this = this;
		Util.ajax({
			url: Api['get_cart_list'],
			success: function(data) {

				var saveStatus = {};
				var lastList = _this.state.list;

				if(lastList.length > 0) {
					lastList.map(item => {
						saveStatus[item.id] = item.checked;
					});
				}

				data.data.map((item) => {
					item.checked = saveStatus[item.id] || false;
				});

				_this.setState({
					list: data.data
				});
				_this.changeFooter(data.data);
			},
			error: function(data) {}
		});
	},
	//编辑购物车
	editCart: function(data, callback) {
		Util.ajax({
			url: Api['edit_cart'],
			data: data,
			success: function(data) {
				callback && callback(data);
			},
			error: function(data) {}
		});
	},
	//改变 cart数量
	editCartCount: function(count) {

		if(this.props.count == count) {
			return false;
		}
		this.props.cartEditCount(count);
	},
	//get cart数量
	getCartCount: function() {
		var _this = this;

		Util.ajax({
			url: Api['get_cart_count'],
			success: function(data) {
				_this.editCartCount(parseInt(data.data.count));
			},
			error: function(data) {}
		});
	},
	//改变选中数量
	changeFooter: function(list) {

		let count = 0;
		let total = 0;
		let checked_num = 0;
		let checked_count = 0;

		list.map((item) => {
			count = Util.floatAdd(count, item.count);

			if (item.checked) {
				checked_num += 1;
				total =  Util.floatAdd(total, item.count * item.price);
				checked_count =  Util.floatAdd(checked_count, item.count);
			}
		});

		this.editCartCount(count);

		this.setState({
			checked_count: checked_count,
			all_checked: checked_num == list.length,
			total: total
		});
	},
	edit: function(type,id) {
		var _this = this;
		var list = this.state.list;

		if(type == 'append' || type == 'remove') {
			list.map((item) => {
				if(item.id == id) {
					item.checked = type == 'append';
				}
			});
		} else if(type == 'up' || type == 'down'){
			var is_allow = true;

			list.map((item) => {
				if(item.id == id) {
					if((type == 'up' && item.count + 1 > 99) || (type == 'down' && item.count - 1 < 1)) {
						is_allow = false;
						return false;
					}
					item.count = type == 'up' ? (item.count + 1) : (item.count - 1);
				}
			});

			if(!is_allow) {
				return false;
			}

			this.editCart({
				type: type,
				id: id
			}, function() {
				_this.changeFooter(list);
				_this.setState({
					list: list
				});
			});

			return false;
		} else if(type == 'all_append' || type == 'all_remove') {
			list.map((item) => {
				item.checked = type == 'all_append';
			});
		} else if(type == 'delete') {

			Util.ajax({
				url: Api['delete_cart'],
				data: {
					id: id
				},
				success: function(data) {
					_this.getList();
				},
				error: function(data) {}
			});

			return false;
		}
		this.changeFooter(list);
		this.setState({
			list: list
		});
	},
	handle: function(event,data) {

		var obj = $(event.currentTarget);
		var name = obj.data('name');
		var id = obj.data('id');

		if(name == 'choose') {
			if(obj.hasClass('active')) {
				this.edit('remove',id);
			} else {
				this.edit('append',id);
			}
		} else if(name == 'up' || name == 'down'){
			this.edit(name,id);
		} else if(name == 'all_choose') {
			obj.hasClass('active') ? this.edit('all_remove',id) : this.edit('all_append',id);
		} else if(name == 'delete') {
			this.edit(name,id);
		}
		Util.stop(event);
	},
	getDefaultProps: function() {
		return ({
			options: {
				mouseWheel: true,
				click: true
			}
		})
	},
	touchStart: function(event) {
		this.page.saveX = event.touches[0].pageX;
		this.page.saveY = event.touches[0].pageY;
	},
	touchMove: function(event) {

		if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;

		var nowX = event.touches[0].pageX;
		var nowY = event.touches[0].pageY;

		let delateX = nowX - this.page.saveX;
		let delateY = nowY - this.page.saveY;

		if(Math.abs(delateX) > Math.abs(delateY) && Math.abs(delateX) > 10) {
			var obj = $(event.currentTarget);
			delateX < 0 && !obj.hasClass('slide') && obj.addClass('slide');
			delateX > 0 && obj.hasClass('slide') && obj.removeClass('slide');
			event.preventDefault();
		}
	},
	//去结算
	cartClearing(event) {
		var _this = this;

		if(this.state.checked_count == 0) {
			return false;
		}

		var list = this.state.list,
		data = {};

		list.map(item => {
			if(item.checked) {
				data[item.id] = item.count;
			}
		});

		var cart_clearing = ReactDOM.findDOMNode(this.refs.cart_clearing);

		var oLoading = document.getElementById('loading');
		ReactDOM.render(<Loading />, oLoading);

		Util.ajax({
			url: Api['go_clearing'],
			data: {
				data: JSON.stringify(data)
			},
			success: function(data) {
				ReactDOM.unmountComponentAtNode(oLoading);

				ReactDOM.render(<Clearing {...this.props} getCartCount={_this.getCartCount} pageUp={_this.pageUp} data={data.data} />, cart_clearing);
				$(cart_clearing).addClass('slide');
			},
			error: function(data) {
				ReactDOM.unmountComponentAtNode(oLoading);
			}
		});
		Util.stop(event);
	},
	//返回上一级
	pageUp: function(event) {
		var cart_clearing = ReactDOM.findDOMNode(this.refs.cart_clearing);
		$(cart_clearing).removeClass('slide');

		setTimeout(function() {
			ReactDOM.unmountComponentAtNode(cart_clearing);
		}, 300);

		Util.stop(event);
	},
	render: function(){
		return (
			<div className="cart clear_scroll">
				<Header type="cart" />
				<ReactIScroll iScroll={iScroll} className="scroll_height" options={this.props.options}>
					<ul className="cart_list">
						{
							this.state.list.map(data => {
								return (
									<li className="of-hidden" style={{position: 'relative'}} key={data.id}>
										<div className="animate" onTouchStart={this.touchStart} onTouchMove={this.touchMove}>
											<div className="fl animate_left">
												<div className="fl">
													<span data-name="choose" data-id={data.id} onClick={this.handle} className={data.checked ? 'checkbox active' : 'checkbox'}></span>
												</div>
												<div className="img fl">
													<img src={data.thumb} />
												</div>
												<div className="fl info">
													<p className="title">{data.title}</p>
													<p className="belong_sort">分类:{data.goods_sort}</p>
													<div className="ticket">
														<span className="c-red">¥{data.price}</span>
														<div className="fr num">
															<a data-name="down" data-id={data.id} onClick={this.handle}>-</a>
															<input data-name="input" data-id={data.id} value={data.count} onChange={this.handle} />
															<a data-name="up" data-id={data.id} onClick={this.handle}>+</a>
														</div>
													</div>
												</div>
											</div>
											<div className="remove fl" data-name="delete" data-id={data.id} onClick={this.handle}>
												删除
											</div>
										</div>
									</li>
								);
							})
						}
					</ul>
				</ReactIScroll>
				<Footer handle={this.handle} clearing={this.cartClearing} state={this.state} type="cart" />
				<div ref="cart_clearing" className="cart_clearing"></div>
			</div>
		)
	}
})