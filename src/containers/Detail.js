import React from 'react'

import { connect } from 'react-redux'
import { cartEditCount } from '../actions/Footer'
import Detail from './../components/Detail'

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

const DetailMap = connect(mapStateToProps,mapDispatchToProps)(Detail);

export default DetailMap;