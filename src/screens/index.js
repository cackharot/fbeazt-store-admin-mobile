const { Navigation } = require('react-native-navigation');
import OrderList from '../modules/orderList';
import OrderListFilter from '../modules/orderListFilter';
import OrderDetails from '../modules/orderDetails';
import ProductList from '../modules/productList';
import ProductDetails from '../modules/productDetails';
import LoginScreen from '../modules/loginScreen';
import SettingsScreen from '../modules/settingsScreen';
import ReportScreen from '../modules/reportScreen';
import reduxHOC from './reduxHOC';

export function registerScreens(store) {
    Navigation.registerComponent('app.LoginScreen', () => reduxHOC(LoginScreen, store));
    Navigation.registerComponent('app.SettingsScreen', () => reduxHOC(SettingsScreen, store));
    Navigation.registerComponent('app.ReportScreen', () => reduxHOC(ReportScreen, store));
    Navigation.registerComponent('app.orderList', () => reduxHOC(OrderList, store));
    Navigation.registerComponent('app.OrderListFilter', () => OrderListFilter);
    Navigation.registerComponent('app.orderDetails', () => reduxHOC(OrderDetails, store));
    Navigation.registerComponent('app.productList', () => reduxHOC(ProductList, store));
    Navigation.registerComponent('app.productDetails', () => reduxHOC(ProductDetails, store));
}
