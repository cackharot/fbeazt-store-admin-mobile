import * as types from '../constants/actionTypes';
import initialState from './initialState';

export default function (state = initialState.reports, action) {
    switch (action.type) {
        case types.RETRIEVE_REPORTS_OUTSTANDING:
            return {
                ...state,
                outstanding: action.data
            };
        case types.RETRIEVE_REPORTS_STATUS_COUNTS:
            return {
                ...state,
                today: action.data
            };
        case types.RETRIEVE_REPORTS_ORDER_TRENDS:
            return {
                ...state,
                orderTrends: action.data
            };
        default:
            return state;
    }
}
