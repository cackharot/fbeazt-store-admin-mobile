import axios from 'axios';
import * as types from '../constants/actionTypes';
import { Platform } from 'react-native';

const baseURL = Platform.OS === 'ios' ? 'http://localhost:4000/api' : 'http://10.0.3.2:4000/api'

function retrieveProductsSuccess(res) {
    return {
        type: types.RETRIEVE_PRODUCT_LIST,
        products: res.data
    };
}

export function retrieveProducts(filter_text) {
    return function (dispatch) {
        return axios.get(`${baseURL}/products/5b307053ac02377970451b41`,
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
