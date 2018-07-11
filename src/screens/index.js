const { Navigation } = require('react-native-navigation');
const WelcomeScreen = require('./WelcomeScreen');

function registerScreens() {
  Navigation.registerComponent('navigation.playground.WelcomeScreen', () => WelcomeScreen);
}

module.exports = {
  registerScreens
};
