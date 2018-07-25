import * as types from '../constants/actionTypes';
import { httpClient } from './httpClient';

function retrieveProductsSuccess(res) {
    return {
        type: types.RETRIEVE_PRODUCT_LIST,
        products: res.data
    };
}

export function retrieveProducts(storeId, filter_text) {
    return function (dispatch) {
        return httpClient.get(`/products/${storeId}`,
            {
                params: {
                    filter_text: filter_text || ""
                }
            })
            .then(res => {
                dispatch(retrieveProductsSuccess(res));
            })
            .catch(error => {
                console.log(error); //eslint-disable-line
            });
    };
}
