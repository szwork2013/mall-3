import React from 'react'
import ReactDOM from 'react-dom'

import NavLink from './common/NavLink'

import Loading from './Loading'
import Util from './common/Util'
import Header from './common/Header'

import GoodsList from './GoodsList'

import ReactIScroll from 'react-iscroll'
var iScroll = require('iscroll');

var Slider = require('react-slick');

const Item = React.createClass({
	render() {
		return (
			<li className="clearfix">
				<NavLink to={`/goods_list/${this.props.data.id}`}>
					<p>{this.props.data.name}</p>
					<div className="img fl">
						<img src={this.props.data.src} />
					</div>
				</NavLink>
			</li>
		)
	}
})

const Index = React.createClass({
	index: 1,
	getInitialState: function () {
		this.index = 1;

		return {
			images: [],
			notices: [],
			goods: [],
			list: [],
			sort: [
				{
					image: 'images/index_sort_pay.png',
					title: '充值中心'
				},
				{
					image: 'images/index_sort_shop.png',
					title: '超市'
				},
				{
					image: 'images/index_sort_logistics.png',
					title: '物流'
				},
				{
					image: 'images/index_sort_focus.png',
					title: '我的关注'
				},
				{
					image: 'images/index_sort_ticket.png',
					title: '领券'
				},
				{
					image: 'images/index_sort_take.png',
					title: '外卖'
				},
				{
					image: 'images/index_sort_other.png',
					title: '金融'
				},
				{
					image: 'images/index_sort_sort.png',
					title: '分类'
				}
			]
		}
	},
	componentDidMount() {
		this.props.changeFooterShowStatus();
		Util.setHeight();

		this.get_images();
		this.get_notice();
		this.get_special_goods();
		this.getSortList();
	},
	//获得轮播图
	get_images: function() {
		var _this = this;
		Util.ajax({
			url: Api['get_images'],
			success: function(data) {
				_this.setState({
					images: data.data
				});

			},
			error: function(data) {}
		});
	},
	//获得公告
	get_notice: function() {
		var _this = this;
		Util.ajax({
			url: Api['get_notice'],
			success: function(data) {
				_this.setState({
					notices: data.data
				});
				_this.noticeSlide(data.data);
			},
			error: function(data) {}
		});
	},
	//获得秒杀商品
	get_special_goods: function() {
		var _this = this;
		Util.ajax({
			url: Api['get_special_goods'],
			success: function(data) {
				_this.setState({
					goods: data.data
				});
			},
			error: function(data) {}
		});
	},
	//获得分类列表
	getSortList: function() {
		var _this = this;
		Util.ajax({
			url: Api['get_sort_list'],
			data: {
				type: 2
			},
			success: function(data) {

				var setData = {};
				setData.list = data.data;

				_this.setState(setData);
			},
			error: function(data) {}
		});
	},
	//查看商品列表
	lookList: function(event) {
		var obj = $(event.currentTarget);
		var goods_list = ReactDOM.findDOMNode(this.refs.goods_list);

		ReactDOM.render(<GoodsList pageUp={this.pageUp} id={obj.data('id')} />, goods_list);
		$(goods_list).addClass('slide');
	},
	pageUp: function(event) {

		var goods_list = ReactDOM.findDOMNode(this.refs.goods_list);
		$(goods_list).removeClass('slide');

		setTimeout(function() {
			ReactDOM.unmountComponentAtNode(goods_list);
		}, 300);

		Util.stop(event);
	},
	//商品头条滚动
	noticeSlide: function(data) {
		var _this = this;

		var oNotice = ReactDOM.findDOMNode(this.refs['notice']),
			oUl = $(oNotice).find('ul').eq(0),
			length = Math.ceil(data.length/2),
			lastLi = oUl.find('li').eq(0),
			height = oNotice.offsetHeight;

		oUl.append(lastLi.clone());

		(function setOut() {
			setTimeout(function() {
				if(!oUl) {
					return false;
				}
				oUl.animate({
					top: -height * _this.index + 'px'
				}, 300, 'linear', function() {
					_this.index ++;
					if(_this.index == length + 1) {
						_this.index = 1;
						oUl.css('top', 0);
					}
					setOut();
				});
			},3000);
		})();
	},
	getDefaultProps: function() {
		return ({
			optionsH: {
				mouseWheel: true,
				click: true
			},
			optionsW: {
				mouseWheel: true,
				scrollX: true,
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
	sortClick: function(event) {
		Util.stop(event);
	},
	render(){

		var notices = [];
		var data = this.state.notices;

		for(let i=0,len=data.length; i< len; i = i+2) {
			notices.push(
				<li key={data[i].id}>
					<p>
						<span className="notice_type">
							{Conf.NOTICE_TYPE[data[i].type]}
						</span>
						{data[i].title}
					</p>
				{
					data[i+1] ?
					<p>
						<span className="notice_type">
							{Conf.NOTICE_TYPE[data[i].type]}
						</span>
						{data[i+1].title}
					</p>: null
				}
				</li>
			)
		}

		return (
			<div className="clear_scroll">
				<div className="index" ref="index">
					<Header />
					<ReactIScroll iScroll={iScroll} className="scroll_height" options={this.props.optionsH}>
						<div>
							<div className="main_header">
								<Slider {...this.props.settings}>
									{
										this.state.images.map(data => {
											return (
												<div key={data.id}>
													<img src={data.src} />
												</div>
											)
										})
									}
								</Slider>
							</div>
							<ul className="clearfix index_sort">
								{
									this.state.sort.map((data, i) => {
										return (
											<li key={i} onClick={this.sortClick}>
												<span className="img">
													<img src={data.image} />
												</span>
												<p>{data.title}</p>
											</li>
										)
									})
								}
							</ul>
							<div className="index_notice clearfix">
								<div className="fl in_title">
									<p>商品</p>
									<p>头条</p>
								</div>
								<div className="in_content" ref="notice">
									<ul>
										{notices}
									</ul>
								</div>
							</div>
							<div className="special_goods">
								<div className="sg_title">
									<strong className="title">/ 秒杀 /</strong>
									<span className="time">
										<span>12</span>:
										<span>12</span>:
										<span>12</span>
									</span>
									<span className="fr">
										<span className="fl">更多秒杀</span>
									</span>
								</div>
								<ReactIScroll iScroll={iScroll} className="sg_content" options={this.props.optionsW}>
									<ul className="clearfix" style={{width: 2.1 * this.state.goods.length + 'rem'}}>
										{
											this.state.goods.map(data => {
												return (
													<li key={data.id}>
														<span className="img">
															<img src={data.src} />
														</span>
														<p className="now_money">¥{data.now_price}</p>
														<p className="once_money">¥{data.old_price}</p>
													</li>
												)
											})
										}
									</ul>
								</ReactIScroll>
							</div>
							{
								this.state.list.map(data => {
									return (
										<div className="hot_list" key={data.id}>
											<div className="hl_title">
												<span className="title">{data.name}</span>
											</div>
											<ul className="clearfix">
												{
													data.data.map(item => {
														return <Item handle={this.lookList} data={item} key={item.id} />
													})
												}
											</ul>
										</div>
									)
								})
							}
						</div>
					</ReactIScroll>
				</div>
				<div ref="goods_list" className="common_wrp goods_list_wrp"></div>
			</div>
		)
	}
})

export default Index