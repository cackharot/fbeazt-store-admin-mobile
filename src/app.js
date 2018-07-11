
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Navigation } from 'react-native-navigation';

class react_native_navigation_bootstrap extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Natisdfd
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
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

Navigation.registerComponent('react-native-navigation-bootstrap', () => react_native_navigation_bootstrap);
Navigation.events().registerAppLaunchedListener(() => {
  // Navigation.startSingleScreenApp({
  //   screen: {
  //     screen: 'react-native-navigation-bootstrap',
  //     title: 'Navigation Bootstrap'
  //   }
  // });
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
            component: {
              name: 'react-native-navigation-bootstrap',
              passProps: {
                text: 'This is tab 1',
                myFunction: () => 'Hello from a function!',
              },
            },
          },
          {
            component: {
              name: 'react-native-navigation-bootstrap',
              passProps: {
                text: 'This is tab 2',
              },
            },
          },
        ],
      },
    }
  });
});
