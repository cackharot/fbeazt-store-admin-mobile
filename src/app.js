import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import { iconsMap, iconsLoaded } from './appIcons';
import { registerScreens } from './screens';

registerScreens();

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
              name: 'order_list',
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
              name: 'order_list',
              options: {
                bottomTab: {
                  text: 'Reports',
                  icon: require('./images/one.png')
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
