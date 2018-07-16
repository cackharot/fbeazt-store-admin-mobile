import { combineReducers } from 'redux';
import storeOrdersReducer from './storeOrdersReducer';
import productsReducer from './productsReducer';

const rootReducer = combineReducers({
	storeOrders: storeOrdersReducer,
	products: productsReducer
});

export default rootReducer;
