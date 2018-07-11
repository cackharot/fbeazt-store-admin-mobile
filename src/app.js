import { Navigation } from 'react-native-navigation';
import { iconsMap, iconsLoaded } from './appIcons';
import { registerScreens } from './screens';
import configureStore from './store/configureStore';

const store = configureStore();

registerScreens(store);

iconsLoaded.then(() => {
  startApp();
});

function setDefaultNavOptions() {
  Navigation.setDefaultOptions({
    statusBar: {
      drawBehind: false,
      visible: true
    },
    topBar: {
      visible: false
    },
    bottomTabs: {
      titleDisplayMode: 'alwaysShow',
      drawBehind: false
    },
    bottomTab: {
      textColor: 'black'
    }
  });
}

function initNav() {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
            component: {
              name: 'app.orderList',
              options: {
                bottomTab: {
                  text: 'Orders',
                  icon: iconsMap['ios-people'],
                }
              },
              passProps: {
              },
            },
          },
          {
            component: {
              name: 'app.orderList',
              options: {
                bottomTab: {
                  text: 'Reports',
                  icon: iconsMap['ios-home']
                }
              },
              passProps: {
              },
            },
          },
          {
            component: {
              name: 'app.orderList',
              options: {
                bottomTab: {
                  text: 'Settings',
                  icon: iconsMap['ios-keypad']
                }
              },
              passProps: {
              },
            },
          },
        ],
      },
    }
  });
}

function startApp() {
  Navigation.events().registerAppLaunchedListener(() => {
    setDefaultNavOptions();
    initNav();
  });
}
