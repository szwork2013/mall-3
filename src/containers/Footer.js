import React from 'react'

import { connect } from 'react-redux'
import { cartEditCount } from '../actions/Footer'
import Footer from '../components/common/Footer'

const mapStateToProps = (state) => {
    return {
        footer: state.footer,
        count: state.footer.count
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        cartEditCount: (count) => {
            dispatch(cartEditCount(count));
        }
    }
}

const FooterMap = connect(mapStateToProps,mapDispatchToProps)(Footer);

export default FooterMap;