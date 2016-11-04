import React from 'react'

import { connect } from 'react-redux'
import { cartEditCount } from '../actions/Footer'
import Clearing from './../components/Clearing'

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

const ClearingMap = connect(mapStateToProps,mapDispatchToProps)(Clearing);

export default ClearingMap;