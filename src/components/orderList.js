import React, { Component } from 'react';
const { View, Text } = require('react-native');
import { Container, Spinner, Header, Content, Icon } from 'native-base';
import * as ordersListActions from '../actions/ordersListActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class OrderListComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: true
    };
  }

  componentWillMount() {
    this._retrieveDetails();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.storeOrders) this.setState({ isLoading: false });
  }

  _retrieveDetails(isRefreshed) {
    this.props.actions.retrieveOrders()
      .then(() => {
        console.log(this.props.storeOrders);
      });
    if (isRefreshed && this.setState({ isRefreshing: false }));
  }

  render() {
    return (
      this.state.isLoading ? <Container><Spinner /></Container> :
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

function mapStateToProps(state, ownProps) {
  return {
    storeOrders: state.storeOrders.list
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ordersListActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { "withRef": true })(OrderListComponent);
