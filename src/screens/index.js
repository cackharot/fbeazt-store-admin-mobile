const { Navigation } = require('react-native-navigation');
import OrderListComponent from '../components/orderList';
import reduxHOC from './reduxHOC';

export function registerScreens(store) {
  Navigation.registerComponent('app.orderList', () => reduxHOC(OrderListComponent, store));
}
