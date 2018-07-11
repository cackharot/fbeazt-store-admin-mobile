const { Component } = require('react');
const { View, Text } = require('react-native');

class WelcomeScreen extends Component {
  render() {
    return (
      <View style={styles.bar}>
        <Text>Welcome</Text>
      </View>
    );
  }
}

module.exports = WelcomeScreen;

const styles = {
  bar: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#e8e8e8',
    justifyContent: 'space-between'
  }
};
