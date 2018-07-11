import { combineReducers } from 'redux';
import storeOrdersReducer from './storeOrdersReducer';

const rootReducer = combineReducers({
	storeOrders: storeOrdersReducer
});

export default rootReducer;
