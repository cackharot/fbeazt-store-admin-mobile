import * as types from '../constants/actionTypes';
import initialState from './initialState';

export default function (state = initialState.products, action) {
    switch (action.type) {
        case types.RETRIEVE_PRODUCT_LIST:
            return {
                ...state,
                list: action.products
            };
        default:
            return state;
    }
}
