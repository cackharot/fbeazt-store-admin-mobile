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
      backgroundColor: '#4D4B88',
      visible: true
    },
    layout: {
      backgroundColor: '#4D4B88',
      orientation: ['portrait', 'landscape'] // An array of supported orientations
    },
    topBar: {
      visible: true,
      drawBehind: false,
      animate: false,
      searchBar: false,
      buttonColor: 'white',
      title: {
        fontSize: 16,
        color: 'white',
        elevation: 0,
      },
      subtitle: {
        fontSize: 14,
        color: 'white',
        // fontFamily: 'Helvetica',
        alignment: 'center'
      },
      backButton: {
        icon: iconsMap['iso-arrow-back'],
        showTitle: false,
      },
      background: {
        color: '#4D4B88'
        // color: 'white'
      }
    },
    bottomTabs: {
      titleDisplayMode: 'alwaysShow',
      backgroundColor: '#4D4B88',
      drawBehind: false
    },
    bottomTab: {
      textColor: 'white',
      iconColor: 'white',
      selectedIconColor: '#4FCBC6',
      selectedTextColor: '#4FCBC6',
    }
  });
}

function initNav() {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
            stack: {
              children: [{
                component: {
                  name: 'app.orderList',
                  options: {
                    topBar: {
                      title: { text: `Orders` }
                    }
                  }
                },
              }],
              options: {
                bottomTab: {
                  text: 'Orders',
                  icon: iconsMap['ios-list'],
                },
              },
            },
          },
          {
            component: {
              name: 'app.orderList',
              options: {
                bottomTab: {
                  text: 'Menu',
                  icon: iconsMap['ios-restaurant']
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
                  icon: iconsMap['ios-stats']
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
                  icon: iconsMap['ios-settings']
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
