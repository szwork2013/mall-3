import React from 'react'
import ReactDOM from 'react-dom'

import Util from './common/Util'

import AddressOperate from './AddressOperate'
import Header from './common/Header'
import Footer from './common/Footer'

import ReactIScroll from 'react-iscroll'
var iScroll = require('iscroll');

const Item = React.createClass({
    render() {
        return (
            <li onClick={this.props.next} data-code={this.props.data.code} data-name={this.props.data.name} data-type={this.props.data.type}>
                {this.props.data.name}
            </li>
        )
    }
})

const List = React.createClass({
    nameArr: [
        'address',
        'receive_name',
        'receive_phone',
        'code',
        'province',
        'city',
        'area',
        'province_name',
        'city_name',
        'area_name'
    ],
    getInitialState: function () {
        var data = {
            list: []
        }
        this.nameArr.map(item => {
            data[item] = '';
        })
        return data;
    },
    componentDidMount() {
        this.getList();
        Util.setHeight();
    },
    getList: function(param, callback) {
        var _this = this;
        var storage = window.sessionStorage;

        var data = storage.getItem('area');

        if(storage && (typeof param == 'undefined' || param.type == 1) && data) {
            _this.setState({
                list: JSON.parse(data)
            });
            return false;
        }

        Util.ajax({
            url: Api['get_area_list'],
            data: param || {},
            success: function(data) {
                callback && callback();

                if(data.data.length === 0) {
                    ReactDOM.findDOMNode(_this.refs.list).style.display = 'none';
                    ReactDOM.findDOMNode(_this.refs.info).style.display = 'block';
                    ReactDOM.findDOMNode(_this.refs.footer).style.display = 'block';
                    return false;
                }

                _this.setState({
                    list: data.data
                });

                if(storage && (typeof param == 'undefined' || param.type == 1)) {
                    storage.setItem('area', JSON.stringify(data.data));
                }
            },
            error: function(data) {}
        });
    },
    //下一步
    next: function(event) {
        var _this = this;
        var obj = $(event.currentTarget);

        var type = obj.data('type');
        var code = obj.data('code');
        var name = obj.data('name');

        var nameTurn = {
            1: 'province',
            2: 'city',
            3: 'area'
        }

        this.getList({
            type: parseInt(type) + 1,
            code: code
        },function() {
            var data = {};
            data[nameTurn[type]] = code;
            data[nameTurn[type] + '_name'] = name;
            _this.setState(data);
        });

        Util.stop(event);
    },
    //保存收货地址
    saveAddress: function(event) {
        var _this = this,
            param = {},
            state = this.state;

        this.nameArr.map(item => {
            param[item] = state[item];
        })

        Util.ajax({
            url: Api['add_address'],
            data: param,
            success: function(data) {
                _this.props.pageUp('refresh');
            },
            error: function(data) {}
        });

        Util.stop(event);
    },
    changeHandle: function(event) {
        var name = event.target.name,
            data = {};
        data[name] = event.target.value;
        this.setState(data);

        Util.stop(event);
    },
    getDefaultProps: function() {
        return ({
            options: {
                mouseWheel: true,
                click: true
            }
        })
    },
    render(){
        return (
            <div>
                <div className="address_operate">
                    <Header type="address_list" {...this.props} />
                    <ReactIScroll iScroll={iScroll} className="scroll_height" options={this.props.options}>
                        <ul ref="list" className="common_padding_top">
                            {
                                this.state.list.map(data => {
                                    return <Item data={data} next={this.next} key={data.id} />
                                })
                            }
                        </ul>
                        <div ref="info" className="common_padding_top write_info none">
                            <p>{this.state.province_name + this.state.city_name + this.state.area_name}</p>
                            <p>
                                <input type="text" name="address" value={this.state.address} onChange={this.changeHandle} placeholder="请输入详细地址" />
                            </p>
                            <p>
                                <input type="text" name="receive_name" value={this.state.receive_name} onChange={this.changeHandle} placeholder="请输入收货人姓名" />
                            </p>
                            <p>
                                <input type="text" name="receive_phone" value={this.state.receive_phone} onChange={this.changeHandle} placeholder="请输入收货人联系电话" />
                            </p>
                            <p>
                                <input type="text" name="code" value={this.state.code} onChange={this.changeHandle} placeholder="请输入邮政编码" />
                            </p>
                        </div>
                    </ReactIScroll>
                    <Footer ref="footer" type="address_operate" handle={this.saveAddress} />
                </div>
            </div>
        )
    }
})

export default List