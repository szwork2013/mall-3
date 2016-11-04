import React from 'react'
import ReactDOM from 'react-dom'

export default React.createClass({
	getInitialState: function () {
		return {}
	},
	componentDidMount() {

		var littleR = 2;
		var value = 0.38 * fontNum;

		var canvas = ReactDOM.findDOMNode(this.refs.pull_loading);
		var ctx = canvas.getContext('2d');

		canvas.width = value;
		canvas.height = value;

		var radius = 0;
		var radiusArr = [0, 45, 90, 135, 180, 225, 270, 315];

		var colorArr = [];
		radiusArr.forEach(() => colorArr.push('#333'));

		function arc (radius){
			ctx.save();
			ctx.clearRect(0,0,value,value);
			ctx.translate(value/2,value/2);
			ctx.rotate(Math.PI / 180 * radius);

			for(var i=0; i<radiusArr.length; i++) {

				var cur = Math.PI / 180 * radiusArr[i];

				ctx.beginPath();
				ctx.fillStyle= colorArr[i];

				var smallR = littleR;
				var r = value/2 - smallR;
				var x =  Math.cos(cur) * r;
				var y =  Math.sin(cur) * r;

				ctx.arc(x, y, smallR, 0, 2*Math.PI);

				ctx.fill();
				ctx.closePath();
			}
			ctx.restore();
		}

		function setOut() {
			setTimeout(function() {
				arc(radius);
				radius = radius + 10;
				setOut();
			}, 30);
		}
		setOut();
	},
	render: function(){
		return (
			<div className="pull_loading clearfix">
				<div className="center">
					<canvas ref="pull_loading"></canvas>
					<span className="pull_info">
					{
						'下拉可以刷新'
					}
					</span>
				</div>

			</div>
		)
	}
})