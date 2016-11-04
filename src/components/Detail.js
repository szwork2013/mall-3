import React from 'react'

import Util from './common/Util'

import Header from './common/Header'
import Footer from './common/Footer'

import ReactIScroll from 'react-iscroll'
var iScroll = require('iscroll');
var Slider = require('react-slick');

export default React.createClass({
	//get 位置
	getPosition: function() {
		var storage = window.sessionStorage;
		return storage && storage.getItem('position') || Conf.DEFAULT_POSITION;
	},
	getInitialState: function () {
		return {
			sort_selected: '',
			images:[],
			comment: {
				data: []
			}
		};
	},
	componentDidMount: function() {
		this.props.changeFooterShowStatus();

		this.getDetail();
		this.getGoodsComment();
		Util.setHeight();
	},
	//获得商品详情
	getDetail: function() {
		var _this = this;
		var param = {
			id: this.props.params.id
		};
		Util.ajax({
			data: param,
			url: Api['get_goods_detail'],
			success: function(data) {
				_this.setState(data.data);

				var goods_sort = data.data.goods_sort;
				goods_sort = goods_sort ? goods_sort.split(',') : [];

				_this.setState({
					sort_selected: goods_sort[0]
				});
			},
			error: function(data) {}
		});
	},
	//获得商品评论
	getGoodsComment: function() {
		var _this = this;
		var param = {
			id: this.props.params.id
		};
		Util.ajax({
			data: param,
			url: Api['get_goods_comment'],
			success: function(data) {
				_this.setState({comment: data});
			},
			error: function(data) {}
		});
	},
	//选择分类
	chooseSort: function(event) {
		var obj = $(event.target);
		if(!obj.is('li')) {
			return false;
		}
		obj.siblings().removeClass('active');
		obj.addClass('active');
		this.setState({
			sort_selected: obj.text()
		})
	},
	//添加商品到购物车
	addCartHandle: function(event) {
		var _this = this,
			id = this.props.params.id,
			sort_selected = this.state.sort_selected,
			count = 1;

		var param = {
			goods_id: id,
			count: count,
			goods_sort: sort_selected
		};

		Util.ajax({
			url: Api['add_cart'],
			data: param,
			success: function(data) {
				Util.alert({
					content: '添加商品成功!',
					type: 'success'
				});
				_this.props.cartEditCount(_this.props.count + count);
			},
			error: function(data) {
				Util.alert({
					content: '添加商品失败!',
					type: 'error'
				});
			}
		});
	},
	getDefaultProps: function() {
		return ({
			options: {
				mouseWheel: true,
				click: true
			},
			settings: {
				speed: 500,
				autoplay: false,
				autoplaySpeed: 3000,
				dots: true,
				useCSS: true,
				slidesToShow: 1,
				slidesToScroll: 1
			}
		})
	},
	render: function(){

		var goods_sort = this.state.goods_sort;
		goods_sort = goods_sort ? goods_sort.split(',') : [];

		return (
			<div id="detail" className="detail">
				<Header type="detail" {...this.props} />
				<ReactIScroll iScroll={iScroll} className="scroll_height" options={this.props.options}>
					<div className="common_padding_top">
						<Slider {...this.props.settings} className="img">
							{
								this.state.images.map((item, i) => {
									return (
										<div className="img" key={i}>
											<img src={Conf.IMG_PATH + item} />
										</div>
									)
								})
							}

						</Slider>
						<div className="info common">
							<p className="title">{this.state.title}</p>
							<p className="c-red money">¥{this.state.price}</p>
						</div>
						<div className="good_sort clearfix common">
							<span className="each_title fl">分类</span>
							<ul className="fl" onClick={this.chooseSort}>
								{
									goods_sort.map((item, i) => {

										return (
											<li key={i} className={i == 0 ? 'active' : ''}>{item}</li>
										)
									})
								}
							</ul>
						</div>
						<div className="interval"></div>
						<div className="other common">
							<p className="address">
								<span className="each_title">送至</span>
								{this.getPosition}
							</p>
							<p className="c-red is_have">有货</p>
						</div>
						<div className="interval"></div>
						<div className="comment">
							<div className="comment_head color_shallow">
								<span>评价({this.state.comment.count})</span>
								<span className="fr">好评{this.state.comment.percent}%</span>
							</div>
							<ul className="comment_list">
								{
									this.state.comment.data.map(data => {
										return (
											<li key={data.id}>
												<div className="comment_title">
													<span className="comment_star">
														<span className={data.score > 1 ? '' : 'hover'}></span>
														<span className={data.score > 2 ? '' : 'hover'}></span>
														<span className={data.score > 3 ? '' : 'hover'}></span>
														<span className={data.score > 4 ? '' : 'hover'}></span>
														<span className={data.score > 5 ? '' : 'hover'}></span>
													</span>
													<span className="fr color_shallow">{data.user_name}</span>
												</div>
												<div className="comment_content">
													{data.content}
												</div>
												<div className="comment_time">{Util.timeToDate(data.date,3)}</div>
											</li>
										)
									})
								}
							</ul>
						</div>
					</div>
				</ReactIScroll>
				<Footer type="detail" {...this.props} handle={this.addCartHandle} />
			</div>
		)
	}
})