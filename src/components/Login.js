import React from 'react'
import ReactDOM from 'react-dom'

import { browserHistory } from 'react-router'
import Util from './common/Util'
import Header from './common/Header'

import NavLink from './common/NavLink'

export default React.createClass({
	getInitialState: function () {
		return {
			name: '',
			password: ''
		};
	},
	componentDidMount: function() {

		var storage = window.sessionStorage;
		storage && storage.removeItem('user_name');

		Util.setHeight();
	},

	login: function(event) {

		var param = this.state;

		$('.input_error').removeClass('input_error');

		for(var key in param) {
			var value = param[key];
			if(!value) {
				$(ReactDOM.findDOMNode(this.refs[key])).addClass('input_error');
				return false;
			}
		}

		var storage = window.sessionStorage;

		Util.ajax({
			url: Api['login'],
			data: param,
			success: function(data) {

				Util.alert({
					content: '登录成功!'
				});

				storage && storage.setItem('user_name', param.name);
				setTimeout(function(){
					browserHistory.push('/');
				}, 2000);
			},
			error: function(data) {}
		});
	},
	changeHandle: function(event) {

		var data = {};
		data[event.target.name] = event.target.value;
		this.setState(data);

		Util.stop(event);
	},
	render: function(){
		return (
			<div className="login">
				<Header type="login" />
				<div className="scroll_height">
					<div className="wrp">
						<div className="input_container">
							<input name="name" ref="name" value={this.state.name} onChange={this.changeHandle} placeholder="用户名/邮箱/已验证手机" />
						</div>
						<div className="input_container">
							<input type="password" name="password" ref="password" value={this.state.password} onChange={this.changeHandle} placeholder="请输入密码" />
						</div>
						<a className="submit" onClick={this.login}>登录</a>
						<label className="save_login">
							<input type="checkbox" />
							<span className="sl_title">一个月内免登陆</span>
						</label>
						<div className="other_operate">
							<a>找回密码</a>
							<NavLink className="fr" to="register">快速注册</NavLink>
						</div>
					</div>
				</div>
			</div>
		)
	}
})