import React from 'react'
import ReactDOM from 'react-dom'

import Util from './common/Util'

export default React.createClass({
	componentDidMount() {

		var value = 1.15 * fontNum;
		var canvas = ReactDOM.findDOMNode(this.refs.canvas);

		Util.loading.call(canvas, {value: value});

	},
	render: function(){
		return (
			<div>
				<div className="hover"></div>
				<div className="content">
					<div className="center">
						<canvas ref="canvas"></canvas>
					</div>
				</div>
			</div>
		)
	}
})