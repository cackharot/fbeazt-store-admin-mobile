import * as types from '../constants/actionTypes';
import { httpClient } from './httpClient';

export function getOutstandingReports(storeId, params) {
    return function (dispatch) {
        return httpClient.get(`/store_order_reports/${storeId}`, {params: params})
            .then(res => {
                dispatch({
                    type: types.RETRIEVE_REPORTS_OUTSTANDING,
                    data: res.data
                });
            })
            .catch(error => {
                console.log(error); //eslint-disable-line
                dispatch({
                    type: types.RETRIEVE_REPORTS_OUTSTANDING,
                    data: {
                        error
                    }
                });
            });
    };
}

export function getReports(storeId, params) {
    return function (dispatch) {
        return httpClient.get(`/store_order_reports/${storeId}`, {params: params})
            .then(res => {
                dispatch({
                    type: types.RETRIEVE_REPORTS_STATUS_COUNTS,
                    data: res.data
                });
            })
            .catch(error => {
                console.log(error); //eslint-disable-line
                dispatch({
                    type: types.RETRIEVE_REPORTS_STATUS_COUNTS,
                    data: {
                        error
                    }
                });
            });
    };
}

export function orderTrends(storeId, params = {}) {
    params.report_type = 'order_trends';
    return function (dispatch) {
        return httpClient.get(`/store_order_reports/${storeId}`, {params: params})
            .then(res => {
                dispatch({
                    type: types.RETRIEVE_REPORTS_ORDER_TRENDS,
                    data: res.data
                });
            })
            .catch(error => {
                console.log(error); //eslint-disable-line
                dispatch({
                    type: types.RETRIEVE_REPORTS_ORDER_TRENDS,
                    data: {
                        error
                    }
                });
            });
    };
}

