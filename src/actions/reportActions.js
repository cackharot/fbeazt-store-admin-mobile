import * as types from '../constants/actionTypes';
import { httpClient } from './httpClient';

function retrieveOrdersSuccess(res) {
    return {
        type: types.RETRIEVE_REPORTS,
        reports: res.data
    };
}

export function getReports(storeId, params) {
    return function (dispatch) {
        return httpClient.get(`/store_order_reports/${storeId}`, {params: params})
            .then(res => {
                dispatch(success(res));
            })
            .catch(error => {
                console.log(error); //eslint-disable-line
                dispatch({
                    type: types.RETRIEVE_REPORTS,
                    reports: {
                       error
                    }
                });
            });
    };
}
