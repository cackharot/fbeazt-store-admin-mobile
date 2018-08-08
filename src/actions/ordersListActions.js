import * as types from '../constants/actionTypes';
import moment from 'moment';
import { httpClient } from './httpClient';

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

function updateOrderStatusSuccess(res) {
    return {
        type: types.UPDATE_ORDER_STATUS,
        updateOrderStatus: res.data
    };
}

function updateOrderStatusFailure(res) {
    return {
        type: types.UPDATE_ORDER_STATUS,
        updateOrderStatus: res.data
    };
}

export function retrieveOrders(storeId, params) {
    const validStatus = ['PENDING','PREPARING','PROGRESS','DELIVERED','CANCELLED','PAID'];
    const order_status = Object.keys(params)
          .filter(k => validStatus.indexOf(k) != -1)
          .filter(k => params[k] === true)
          .join(",");
    return function (dispatch) {
        return httpClient.get(`/store_orders/${storeId}`,
            {
                params: {
                    order_status: order_status,
                    start_date: params.start_date,
                    end_date: params.end_date,
                    only_today: params.only_today
                }
            })
            .then(res => {
                dispatch(retrieveOrdersSuccess(res));
            })
            .catch(error => {
                console.log(error); //eslint-disable-line
            });
    };
}

export function retrieveOrderDetails(storeId, storeOrderId) {
    return function (dispatch) {
        return httpClient.get(`/store_orders/${storeId}?store_order_id=${storeOrderId}`)
            .then(res => {
                dispatch(retrieveOrderDetailsSuccess(res));
            })
            .catch(error => {
                console.log(error); //eslint-disable-line
            });
    };
}

export function updateOrderStatus(storeId, storeOrderId, status) {
    return function (dispatch) {
        const payload = {
            store_id: storeId,
            store_order_id: storeOrderId,
            status: status,
            notes: ''
        };
        return httpClient.post(`/store_order_status`, payload)
            .then(res => {
                dispatch(updateOrderStatusSuccess(res));
            })
            .catch(error => {
                dispatch(updateOrderStatusFailure(error.response));
                console.log(error.response); //eslint-disable-line
            });
    };
}
