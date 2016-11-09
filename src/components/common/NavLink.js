import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
    render() {
        return <Link {...this.props} activeClassName="active" onClick={this.addActive} />
    },
    addActive(e){
        console.log(e.target);
        $(".footer a, .footer li").removeClass("active");
        $(e.target).closest("li").addClass("active");
    }
})