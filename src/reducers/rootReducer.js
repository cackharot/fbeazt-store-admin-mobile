import { combineReducers } from 'redux';
import storeOrdersReducer from './storeOrdersReducer';
import productsReducer from './productsReducer';
import reportsReducer from './reportsReducer';

const rootReducer = combineReducers({
  	storeOrders: storeOrdersReducer,
	  products: productsReducer,
	  reports: reportsReducer
});

export default rootReducer;
