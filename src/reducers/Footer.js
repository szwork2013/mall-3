import {combineReducers} from 'redux'
import { routerReducer } from 'react-router-redux'

import {
    CART_EDIT_COUNT
} from '../actions/Footer'

const Footer = function(state={
    count: 0
}, action) {
    switch(action.type) {
        case CART_EDIT_COUNT:
            return Object.assign({}, state, {
                count: action.count
            });
        default:
            return state;
    }
}

export default Footer