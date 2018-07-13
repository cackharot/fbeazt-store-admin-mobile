import axios from 'axios';
import * as types from '../constants/actionTypes';
import { Platform } from 'react-native';

const baseURL = Platform.OS === 'ios' ? 'http://localhost:4000/api' : 'http://10.0.3.2:4000/api'

//retrieve courses
export function retrieveOrdersSuccess(res) {
    return {
        type: types.RETRIEVE_ORDER_LIST,
        orders: res.data
    };
}

export function retrieveOrderDetailsSuccess(res) {
    return {
        type: types.RETRIEVE_ORDER_DETAILS,
        details: res.data
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

