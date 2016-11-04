import React from 'react'

import { connect } from 'react-redux'
import { cartEditCount } from '../actions/Footer'
import Cart from './../components/Cart'

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

const CartMap = connect(mapStateToProps,mapDispatchToProps)(Cart);

export default CartMap;