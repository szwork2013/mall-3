import React from 'react'

import Header from './common/Header'
import Footer from './common/Footer'

import ReactIScroll from 'react-iscroll'
var iScroll = require('iscroll');

import Util from './common/Util'

export default React.createClass({
	getInitialState: function () {
		const arr = [];

		for(var i=0; i<20; i++) {
			arr[i] = {id: i};
		}

		return {
			list: arr
		}
	},
	componentDidMount: function() {
		this.props.changeFooterShowStatus();

		Util.setHeight();
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
			<div className="tool">
				<Header type="tool" />
				<ReactIScroll iScroll={iScroll} className="scroll_height" options={this.props.options}>
					<div className="tool_list common_padding_top">
						<ul className="clearfix">
							{
								this.state.list.map((item, i) => {
									return (
										<li key={item.id} className={(i+1)%3 ==0 ? 'no_br': ''}>
											<span className="tool_icon">
												<img src="images/tool_stock.png" />
											</span>
											<p>进货</p>
										</li>
									)
								})
							}
						</ul>
					</div>
				</ReactIScroll>
			</div>
		)
	}
})