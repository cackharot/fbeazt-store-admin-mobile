const { Navigation } = require('react-native-navigation');
const WelcomeScreen = require('./WelcomeScreen');
const OrderListComponent = require('../components/orderList');

function registerScreens() {
  Navigation.registerComponent('order_list', () => OrderListComponent);
}

module.exports = {
  registerScreens
};
