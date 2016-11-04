import React from 'react'

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
import NavLink from './common/NavLink'

import Util from './common/Util'
import Footer from './../containers/Footer'

export default React.createClass({
    getInitialState: () => {
        return {
            status: 1
        }
    },
    componentDidMount: function() {
        this.getLocation();
    },
    //get位置
    getLocation: function() {

        return false;

        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == 0){
                alert(JSON.stringify(r));
                Util.getPosition.success(r.point);
                //alert('您的位置：'+r.point.lng+','+r.point.lat);
            }
            else {
                alert('failed'+this.getStatus());
            }
        },{enableHighAccuracy: true});

        return false;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(Util.getPosition.success, Util.getPosition.error);
        }
    },
    changeFooterShowStatus: function() {

        let value = 1;
        let pathName = this.props.location.pathname;

        if(pathName.startsWith('/goods_list') || pathName.startsWith('/detail')) {
            value = 0;
        }

        console.log(value);
        if(this.state.status == value) {
            return false;
        }
        this.setState({
            status: value
        })
    },
    render() {
        return (
            <div>
                {this.props.children && React.cloneElement(this.props.children, {
                    changeFooterShowStatus: this.changeFooterShowStatus,
                })}
                {
                    this.state.status == 1 ? <Footer type="common" /> : null
                }
                {/*<ReactCSSTransitionGroup component="div" transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                    <div key={this.props.location.pathname}>

                    </div>
                </ReactCSSTransitionGroup>*/}
            </div>
        )
    }
})
