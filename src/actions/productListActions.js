import * as types from '../constants/actionTypes';
import { httpClient } from './httpClient';

function retrieveProductsSuccess(res) {
    return {
        type: types.RETRIEVE_PRODUCT_LIST,
        products: res.data
    };
}

export function retrieveProducts(filter_text) {
    return function (dispatch) {
        return httpClient.get(`/products/5b307053ac02377970451b41`,
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
