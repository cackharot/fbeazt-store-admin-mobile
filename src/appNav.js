import { Navigation } from 'react-native-navigation';
import { iconsMap } from './appIcons';

export function setDefaultNavOptions() {
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


export function showLogin() {
  Navigation.setRoot({
    root: {
      component: {
        name: 'app.LoginScreen'
      }
    }
  });
}

export function showMainApp() {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
            stack: {
              children: [{
                component: {
                  name: 'app.productList',
                  options: {
                    topBar: {
                      title: { text: `Menu` }
                    }
                  }
                },
              }],
              options: {
                bottomTab: {
                  text: 'Menu',
                  icon: iconsMap['ios-restaurant'],
                },
              },
            },
          },
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
                  icon: iconsMap['ios-notifications'],
                },
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
              name: 'app.SettingsScreen',
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
