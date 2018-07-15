import axios from 'axios';
import * as types from '../constants/actionTypes';
import { Platform } from 'react-native';

const baseURL = Platform.OS === 'ios' ? 'http://localhost:4000/api' : 'http://10.0.3.2:4000/api'

function retrieveOrdersSuccess(res) {
    return {
        type: types.RETRIEVE_ORDER_LIST,
        orders: res.data
    };
}

function retrieveOrderDetailsSuccess(res) {
    return {
        type: types.RETRIEVE_ORDER_DETAILS,
        details: res.data
    };
}

function updateOrderStatusSuccess(res){
    return {
        type: types.UPDATE_ORDER_STATUS,
        updateOrderStatus: res.data
    };
}

function updateOrderStatusFailure(res){
    return {
        type: types.UPDATE_ORDER_STATUS,
        updateOrderStatus: res.data
    };
}

export function retrieveOrders() {
    return function (dispatch) {
        return axios.get(`${baseURL}/store_orders/5b307053ac02377970451b41`)
            .then(res => {
                dispatch(retrieveOrdersSuccess(res));
            })
            .catch(error => {
                console.log(error); //eslint-disable-line
            });
    };
}

export function retrieveOrderDetails(storeOrderId) {
    return function (dispatch) {
        return axios.get(`${baseURL}/store_orders/5b307053ac02377970451b41?store_order_id=${storeOrderId}`)
            .then(res => {
                dispatch(retrieveOrderDetailsSuccess(res));
            })
            .catch(error => {
                console.log(error); //eslint-disable-line
            });
    };
}

export function updateOrderStatus(storeOrderId, status) {
    return function (dispatch) {
        const payload = {
            store_id: '5b307053ac02377970451b41',
            store_order_id: storeOrderId,
            status: status,
            notes: ''
        }
        return axios.post(`${baseURL}/store_order_status`, payload)
            .then(res => {
                dispatch(updateOrderStatusSuccess(res));
            })
            .catch(error => {
                dispatch(updateOrderStatusFailure(error.response));
                console.log(error.response); //eslint-disable-line
            });
    };
}
