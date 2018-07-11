
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Container, Header, Content, Icon } from 'native-base';

import { iconsMap, iconsLoaded } from './appIcons';

class OrderListComponent extends Component {
  render() {
    return (
      <Container>
        <Header />
        <Content>
          <Icon ios='ios-home' name='home' />
          <Icon ios='ios-menu' android="md-menu" style={{ fontSize: 20, color: 'red' }} />
          <Icon type="FontAwesome" name="home" />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

Navigation.registerComponent('order_list', () => OrderListComponent);

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
