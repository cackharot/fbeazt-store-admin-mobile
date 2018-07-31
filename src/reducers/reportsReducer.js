import * as types from '../constants/actionTypes';
import initialState from './initialState';

export default function (state = initialState.reports, action) {
    switch (action.type) {
        case types.RETRIEVE_REPORTS_STATUS_COUNTS:
            return {
                ...state,
                statusCounts: action.data
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
