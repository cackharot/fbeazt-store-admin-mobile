import * as types from '../constants/actionTypes';
import initialState from './initialState';

export default function (state = initialState.storeOrders, action) {
    switch (action.type) {
        case types.RETRIEVE_ORDER_LIST:
            return {
                ...state,
                list: action.orders
            };
        case types.RETRIEVE_ORDER_DETAILS:
            return {
                ...state,
                details: action.details
            };
        case types.UPDATE_ORDER_STATUS:
            return {
                ...state,
                updateOrderStatus: action.updateOrderStatus
            };
        default:
            return state;
    }
}
