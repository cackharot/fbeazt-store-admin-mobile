const { Navigation } = require('react-native-navigation');
import OrderList from '../modules/orderList';
import OrderDetails from '../modules/orderDetails';
import ProductList from '../modules/productList';
import ProductDetails from '../modules/productDetails';
import reduxHOC from './reduxHOC';

export function registerScreens(store) {
  Navigation.registerComponent('app.orderList', () => reduxHOC(OrderList, store));
  Navigation.registerComponent('app.orderDetails', () => reduxHOC(OrderDetails, store));
  Navigation.registerComponent('app.productList', () => reduxHOC(ProductList, store));
  Navigation.registerComponent('app.productDetails', () => reduxHOC(ProductDetails, store));
}
