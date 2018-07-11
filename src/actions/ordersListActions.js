import axios from 'axios';
import * as types from '../constants/actionTypes';

//retrieve courses
export function retrieveOrdersSuccess(res) {
    return {
        type: types.RETRIEVE_ORDER_DETAILS,
        orders: res.data
    };
}

export function retrieveOrders() {
    return function (dispatch) {
        return axios.get(`http://localhost:4000/api/store_orders/5b307053ac02377970451b41`)
            .then(res => {
                dispatch(retrieveOrdersSuccess(res));
            })
            .catch(error => {
                console.log(error); //eslint-disable-line
            });
    };
}

