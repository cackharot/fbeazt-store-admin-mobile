import * as types from '../constants/actionTypes';
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

export function retrieveOrders(storeId, orderStatus) {
    return function (dispatch) {
        return httpClient.get(`/store_orders/${storeId}`,
            {
                params: {
                    order_status: Object.keys(orderStatus).filter(k => orderStatus[k]).join(",")
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
