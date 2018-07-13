const { Navigation } = require('react-native-navigation');
import OrderListComponent from '../modules/orderList';
import OrderDetailsComponent from '../modules/orderDetails';
import reduxHOC from './reduxHOC';

export function registerScreens(store) {
  Navigation.registerComponent('app.orderList', () => reduxHOC(OrderListComponent, store));
  Navigation.registerComponent('app.orderDetails', () => reduxHOC(OrderDetailsComponent, store));
}
