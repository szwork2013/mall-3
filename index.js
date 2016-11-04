require('babel-polyfill');

import React from 'react'
import {render} from 'react-dom'

import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { Router, Route, IndexRoute, browserHistory} from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import rootReducer from './src/reducers'

import Main from './src/components/Main'

import Index from './src/components/Index'
import Sort from './src/components/Sort'

import GoodsList from './src/components/GoodsList'
import Detail from './src/containers/Detail'

import Tool from './src/components/Tool'
import Cart from './src/containers/Cart'
import My from './src/components/My'
import Address from './src/components/AddressList'

import Login from './src/components/Login'
import Register from './src/components/Register'

import WaitPay from './src/components/WaitPay'

const loggerMiddleware = createLogger();

const store = createStore(
	rootReducer,
	applyMiddleware(
		thunkMiddleware
		//loggerMiddleware
	)
);
const history = syncHistoryWithStore(browserHistory, store);

render(
	<Provider store={store}>
	<Router history={history}>
		<Route path="/" component={Main}>
			<IndexRoute component={Index}/>
			<Route path="index" component={Index}/>
			<Route path="sort" component={Sort}/>
			<Route path="goods_list/:id" component={GoodsList}/>
			<Route path="detail/:id" component={Detail}/>
			<Route path="tool" component={Tool}/>
			<Route path="cart" component={Cart}/>
			<Route path="my" component={My}/>
			<Route path="address" component={Address}/>
			<Route path="login" component={Login}/>
			<Route path="register" component={Register}/>
			<Route path="order/wait_pay" component={WaitPay}/>
			<Route path="order/wait_receive" component={WaitPay}/>
		</Route>
	</Router>
	</Provider>,
	document.getElementById('wrapper')
)
