import {combineReducers} from 'redux'
import { routerReducer } from 'react-router-redux'

import Footer from './Footer'

const rootReducer = combineReducers({
    footer: Footer,
    routing: routerReducer
});

export default rootReducer