import React from 'react'
import ReactDOM from 'react-dom'

import Util from './common/Util'

import NavLink from './common/NavLink'
import Header from './common/Header'

export default React.createClass({
	getInitialState: function () {
		return {
			phone: '',
			code: '',
			name: '',
			password: '',
			disabled: true
		};
	},
	componentDidMount: function() {
		Util.setHeight();
	},
	changeHandle: function(event) {
		var data = {};
		var name = event.target.name;
		var value = event.target.value;

		if(name == 'phone') {
			var get_code = $(ReactDOM.findDOMNode(this.refs.get_code));

			if(value.length == 11) {
				this.setState({
					disabled: false
				});
				$(get_code).addClass('allow');
			} else {
				this.setState({
					disabled: true
				});
				$(get_code).removeClass('allow');
			}
		}

		data[name] = value;
		this.setState(data);

		Util.stop(event);
	},
	//获取手机验证码
	getCode: function(event) {

		var _this = this,
			obj = $(event.target),
			time = 120,
			phone = this.state.phone;

		this.setState({
			disabled: true
		});
		obj.removeClass('allow').text(`再次发送(${time})`);

		var param = {
			phone: phone
		};

		Util.ajax({
			url: Api['get_code'],
			data: param,
			success: function(data) {

				Util.alert({
					content: data.data.info
				});

				var inter = setInterval(function() {
					time -= 1;

					if(time === 0) {
						clearInterval(inter);
						_this.setState({
							disabled: false
						});
						obj.addClass('allow').text('获取短信验证码');
					} else {
						obj.text(`再次发送(${time})`);
					}
				}, 1000);
			},
			error: function(data) {
				_this.setState({
					disabled: false
				});
				obj.addClass('allow').text('获取短信验证码');
			}
		});

		Util.stop(event);
	},
	//注册提交
	registerHandle: function(event) {

		var param = {};
		for(var key in this.state) {
			if(key == 'disabled') {
				continue;
			}
			param[key] = this.state[key];
		}

		$('.input_error').removeClass('input_error');

		for(var key in param) {
			var value = param[key];
			if(!value) {
				$(ReactDOM.findDOMNode(this.refs[key])).addClass('input_error');
				return false;
			}
		}

		Util.ajax({
			url: Api['register'],
			data: param,
			success: function(data) {

				Util.alert({
					content: '注册成功!'
				});

				var storage = window.sessionStorage;
				storage && storage.setItem('user_name', param.name);

				setTimeout(function(){
					window.location.href = '/#index';
				}, 2000);
			},
			error: function(data) {}
		});
	},
	render: function(){
		return (
			<div className="register login">
				<Header type="register" />
				<div className="scroll_height">
					<div className="wrp">
						<div className="clearfix">
							<div className="input_container phone_container fl">
								<input ref="phone" name="phone" maxLength="11" value={this.state.phone} onChange={this.changeHandle} placeholder="请输入手机号" />
							</div>
							<button ref="get_code" className="get_code fr" onClick={this.getCode} disabled={this.state.disabled}>获取短信验证码</button>
						</div>
						<div className="input_container">
							<input ref="code" name="code" value={this.state.code} onChange={this.changeHandle} placeholder="请输入短信验证码" />
						</div>
						<div className="input_container">
							<input ref="name" name="name" value={this.state.name} onChange={this.changeHandle} placeholder="请设置用户名" />
						</div>
						<div className="input_container">
							<input ref="password" type="password" name="password" value={this.state.password} onChange={this.changeHandle} placeholder="请设置6-20位登录密码" />
						</div>
						<a className="submit" onClick={this.registerHandle}>注册</a>
						<label className="save_login">
							<span className="sl_title">注册即视为同意
								<a className="c-red">&lt;&lt;月亮协议&gt;&gt;</a>
							</span>
						</label>
					</div>
				</div>
			</div>
		)
	}
})