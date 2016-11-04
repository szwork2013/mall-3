import React from 'react'

const Select = React.createClass({
	render: function() {
		return (
			<div className="center">
				<div className="close">
					<span className="glyphicon glyphicon-remove" onClick={this.props.data.error}></span>
				</div>
				<p>{this.props.data.content}</p>
				<div className="operate_wrp">
					<a className="submit" onClick={this.props.data.success}>确定</a>
					<a className="cancel" onClick={this.props.data.error}>取消</a>
				</div>
			</div>
		)
	}
})

const Hint = React.createClass({
	render: function() {
		return (
			<div className="center">
				<div className="hint_icon">
					<span className={this.props.data.type == 'success' ? 'glyphicon glyphicon-ok-circle' : 'glyphicon glyphicon-remove-circle'}></span>
				</div>
				<p>{this.props.data.content}</p>
			</div>
		)
	}
})

export default React.createClass({
	render: function(){
		var way = this.props.data.way;

		return (
			<div>
				<div className="hover"></div>
				<div className="content">
					{
						way == 'select' ? <Select {...this.props} /> : <Hint {...this.props} />
					}
				</div>
			</div>
		)
	}
})