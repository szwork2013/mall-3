import React from 'react'
import ReactDOM from 'react-dom'

import Util from './common/Util'
import NavLink from './common/NavLink'
import PullDownLoading from './common/PullDownLoading'
import PullUpLoading from './common/PullUpLoading'
import Header from './common/Header'

import Detail from './Detail'

import ReactIScroll from 'react-iscroll'
var iScroll = require('iscroll/build/iscroll-probe');

const Item = React.createClass({
	render() {
		return (
			<li className="clearfix common">
				<NavLink to={`/detail/${this.props.data.id}`}>
					<div className="img fl">
						<img src={Conf.IMG_PATH + this.props.data.thumb} />
					</div>
					<div className="fl info">
						<p className="title">{this.props.data.title}</p>
						<p className="money">¥{this.props.data.price}</p>
						<p className="comment">
							<span>{this.props.data.comment_num}条评论</span>
							<span className="good_percent">好评{this.props.data.comment_percent}%</span>
						</p>
					</div>
				</NavLink>
			</li>
		)
	}
})

const List = React.createClass({
	page: {
		page: 1,
		num: 8,
		count: 0
	},
	getInitialState: function () {
		this.page.page = 1;
		this.page.count = 0;

		return {
			list: []
		}
	},
	componentDidMount() {
		this.getList();
		this.props.changeFooterShowStatus();
	},
	getList: function(type, callback) {

		var _this = this;

		if(type == 'refresh') {
			this.page.page = 1;
		} else if(type == 'more') {
			_this.page.page += 1;
		}

		var page = this.page.page;
		var num = this.page.num;
		var count = this.page.count;

		if(count != 0 && page > Math.ceil(count/num)) {
			return false;
		}

		if(count != 0 && page == Math.ceil(count/num)) {
			Util.setHeight();
		} else {
			Util.setHeight('pull_loading');
		}

		var param = {
			page: page,
			num: num,
			id: this.props.params.id
		};

		Util.ajax({
			url: Api['get_goods_list'],
			data: param,
			success: function(data) {
				_this.page.count = data.count;

				var list = data.data;

				if(type == 'more') {
					list = 	_this.state.list.concat(list);
				}

				_this.setState({
					list: list
				});

				callback && callback();
			},
			error: function(data) {}
		});
	},
	lookDetail(event) {

		var obj = $(event.currentTarget);
		var id = obj.data('id');
		var detail = ReactDOM.findDOMNode(this.refs.detail);

		//ReactDOM.render(<Detail pageUp={this.pageUp} id={id} />, detail);
		//$(detail).addClass('slide');
		//Util.setHeight(detail).stop(event);
	},
	pageUp: function(event) {
		var detail = ReactDOM.findDOMNode(this.refs.detail);
		$(detail).removeClass('slide');

		setTimeout(function() {
			ReactDOM.unmountComponentAtNode(detail);
		}, 300);

		Util.stop(event);
	},
	getDefaultProps: function() {
		return ({
			options: {
				mouseWheel: true,
				click: true,
				probeType: 2
			}
		})
	},
	//排序
	sortHandle: function(event){
		var obj = $(event.currentTarget);
		obj.siblings().removeClass('active');
		obj.addClass('active');

		this.setState({
			list: this.state.list.reverse()
		});
	},
	status: 0,
	onScroll: function(event) {

		if(event.y > event.maxScrollY && event.y < 0 || this.status == 2 || this.status == 5) {
			return false;
		}

		var node = ReactDOM.findDOMNode(this.refs[event.y > 0 ? 'pull_down_loading' : 'pull_up_loading']);

		if(!node) {
			return false;
		}

		var infoNode = node.querySelector('.pull_info');

		//上拉加载
		if(event.y < event.maxScrollY && event.maxScrollY - event.y < 1 * fontNum && event.directionY > 0 && this.status != 3) {
			this.status = 3;
			infoNode.innerHTML = '上拉可以加载';
		}

		if(event.y < event.maxScrollY && event.maxScrollY - event.y >= 1 * fontNum && this.status != 4) {
			this.status = 4;
			infoNode.innerHTML = '松开立即加载';
		}
		//下拉刷新
		if(event.y > 0 && event.y < 1 * fontNum && event.directionY < 0 && this.status != 0) {
			this.status = 0;
			infoNode.innerHTML = '下拉可以刷新';
		}

		if(event.y >= 1 * fontNum && this.status != 1) {
			infoNode.innerHTML = '松开立即刷新';
			this.status = 1;
		}
	},
	onTouchEnd: function(event) {

		var _this = this;

		if(this.status != 1 && this.status != 4) {
			return false;
		}

		var node = ReactDOM.findDOMNode(this.refs[this.status == 1 ? 'pull_down_loading' : 'pull_up_loading']);
		var infoNode = node.querySelector('.pull_info');

		this.refs.iScroll.withIScroll((iScroll) => {

			if(this.status == 1 && iScroll.y >= 1 * fontNum) {

				this.status = 2;
				infoNode.innerHTML = '刷新中....';

				iScroll.scrollTo(0,1 * fontNum, 300);
				iScroll.enabled = false;

				setTimeout(function() {
					_this.getList('refresh', () => {
						_this.status = 0;
						infoNode.innerHTML = '下拉可以刷新';

						iScroll.enabled = true;
						iScroll.scrollTo(0, 0, 300);
					})
				}, 1000);

			} else if(this.status = 4 && iScroll.maxScrollY - iScroll.y >= 1 * fontNum) {

				this.status = 5;
				infoNode.innerHTML = '加载中....';

				iScroll.scrollTo(0, iScroll.maxScrollY - 1 * fontNum, 300);
				iScroll.enabled = false;

				var maxScrollY = iScroll.maxScrollY;
				setTimeout(function() {
					_this.getList('more', () => {

						_this.status = 0;
						infoNode.innerHTML = '上拉可以加载';

						iScroll.enabled = true;
						iScroll.scrollTo(0, maxScrollY, 300);
					})
				}, 1000);
			}
		})
	},
	render(){
		return (
			<div>
				<div className="goods_list" ref="main">
					<Header type="goods_list" {...this.props} handle={this.sortHandle} />
					<ReactIScroll ref="iScroll" iScroll={iScroll} className="scroll_height" options={this.props.options} onTouchEnd={this.onTouchEnd} onScroll={this.onScroll}>
						<div>
							<PullDownLoading ref="pull_down_loading" />
							<ul className="list">
								{
									this.state.list.map(data => {
										return <Item data={data} key={data.id} />
									})
								}
							</ul>
							{
								this.page.page < Math.ceil(this.page.count/this.page.num) && <PullUpLoading ref="pull_up_loading" />
							}
						</div>
					</ReactIScroll>
				</div>
				{/*<div ref="detail" className="goods_detail_wrp"></div>*/}
			</div>
		)
	}
})

export default List