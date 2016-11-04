import React from 'react'
import ReactDOM from 'react-dom'

import NavLink from './common/NavLink'
import GoodsList from './GoodsList'
import Header from './common/Header'
import Footer from './common/Footer'

import ReactIScroll from 'react-iscroll'
var iScroll = require('iscroll');

import Util from './common/Util'

const Sort1Item = React.createClass({
	render() {
		return (
			<li className={this.props.data.id == 1 ? 'active' : ''} onClick={this.props.handle} data-id={this.props.data.id}>
				{this.props.data.name}
			</li>
		)
	}
});

const Sort2Item = React.createClass({
	render() {
		return (
			<li>
				<NavLink to={`/goods_list/${this.props.data.id}`}>
					<div className="img">
						<img src={Conf.IMG_PATH + this.props.data.src} />
					</div>
					<p className="name">{this.props.data.name}</p>
				</NavLink>
			</li>
		)
	}
});

export default React.createClass({
	getInitialState: function () {
		return {
			sort1_list: [],
			sort2_list: []
		};
	},
	componentDidMount: function() {

		this.props.changeFooterShowStatus();

		this.getSortList(1);
		this.getSortList(2);
		Util.setHeight();
	},
	getSortList: function(type, id) {

		var _this = this,
			storage = window.localStorage;

		var sort = storage && storage.getItem('sort');

        if(type == 1 && sort) {
			_this.setState({
				sort1_list: JSON.parse(sort)
			});

            return false;
		}

		var param = {
			type: type
		};
		type == 2 && (param['id'] = id);

		Util.ajax({
			url: Api['get_sort_list'],
			data: param,
			success: function(data) {

				var setData = {};

				setData['sort'+type+'_list'] = data.data;

				_this.setState(setData);

				type == 1 && storage.setItem('sort', JSON.stringify(data.data));
			},
			error: function(data) {}
		});
	},
	chooseHandle: function(event) {

		var obj = $(event.currentTarget);
		var id = obj.data('id');

		$('.sort1 .active').removeClass('active');
		obj.addClass('active');

		var position = obj.position();
		var top = position.top;

		this.refs.iScroll.withIScroll(function(iScroll) {

			var halfHeight = iScroll.wrapperHeight / 2 - 0.96  * fontNum / 2;
			var y = top - halfHeight;

			if(y < 0) {
				if(top - iScroll.y <= halfHeight && iScroll.y >= 0) {
					return false;
				}
				y = y < iScroll.y ? iScroll.y : y;
			} else {
				var differ = iScroll.y - iScroll.maxScrollY;
				if(differ == y){
					return false;
				}
				y = differ < y ? differ : y;
			}

			iScroll.scrollBy(0,-y,500);
		});

		this.getSortList(2,id);
		Util.stop(event);
	},
	lookList: function(event) {

		var obj = $(event.currentTarget);
		Util.stop(event);

		//var goods_list = ReactDOM.findDOMNode(this.refs.goods_list);
		//ReactDOM.render(<GoodsList pageUp={this.pageUp} id={obj.data('id')} />, goods_list);//
        //$(goods_list).addClass('slide');
	},
	pageUp: function(event) {

		var goods_list = ReactDOM.findDOMNode(this.refs.goods_list);
		$(goods_list).removeClass('slide');
		setTimeout(function() {
			ReactDOM.unmountComponentAtNode(goods_list);
		}, 300);

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
	render: function(){
		return (
			<div className="clear_scroll">
				<div className="sort" ref="main">
					<Header />
					<div className="clearfix">
						<div className="sort1 fl p-r">
							<ReactIScroll ref="iScroll" iScroll={iScroll} className="scroll_height" options={this.props.options}>
								<ul className="common_padding_top">
									{
										this.state.sort1_list.map(data=> {
											return <Sort1Item handle={this.chooseHandle} data={data} key={data.id} />
										})
									}
								</ul>
							</ReactIScroll>
						</div>
						<div className="fl sort2">
							<ReactIScroll iScroll={iScroll} className="scroll_height" options={this.props.options} onScroll={this.onScroll}>
								<div className="common_padding_top">
									<div className="sort2_header">
										<img src="images/sort_header.jpg" />
									</div>
									{
										this.state.sort2_list.map(data => {
											return (
												<div key={data.id}>
													<h4>{data.name}</h4>
													<ul className="clearfix">
														{
															data.data.map(data => {
																return <Sort2Item handle={this.lookList} data={data} key={data.id} />
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
					</div>
				</div>
				{/*<div ref="goods_list" className="goods_list_wrp"></div>*/}
			</div>
		)
	}
})