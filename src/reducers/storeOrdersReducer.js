import * as types from '../constants/actionTypes';
import initialState from './initialState';

export default function (state = initialState.storeOrders, action) {
    switch (action.type) {
        case types.RETRIEVE_ORDER_DETAILS:
            return {
                ...state,
                list: action.orders
            };
        default:
            return state;
    }
}
