import React, { Component } from 'react';
const { View, Text } = require('react-native');
import { Container, Header, Content, Icon } from 'native-base';

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

module.exports = OrderListComponent;
