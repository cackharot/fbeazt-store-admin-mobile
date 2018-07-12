import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ListView,
  Platform
} from 'react-native';
import { Container, Spinner, Header, Title, Body, Content, Icon } from 'native-base';
import * as ordersListActions from '../actions/ordersListActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles/orders';

import CardTwo from './components/cardTwo';
import CardThree from './components/cardThree';
import ProgressBar from './components/progressBar';

class OrderListComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      isLoading: true,
      isRefreshing: false
    };

    this._viewOrder = this._viewOrder.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentWillMount() {
    this._retrieveOrders();
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.storeOrders) this.setState({ isLoading: false });
  // }

  _viewOrder(order_id) {
    console.log(`order id ${order_id}`);
  }

  _onRefresh() {
    this.setState({ isRefreshing: true });
    this._retrieveOrders(true);
  }

  _retrieveOrders(isRefreshed) {
    this.props.actions.retrieveOrders()
      .then(() => {
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        const dataSource = ds.cloneWithRows(this.props.storeOrders.items);
        this.setState({
          list: this.props.storeOrders.items,
          dataSource,
          isLoading: false
        });
      });
    if (isRefreshed && this.setState({ isRefreshing: false }));
  }

  render() {
    return (
      this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
        <Container>
          <Header>
            <Body>
              <Title>Orders</Title>
            </Body>
          </Header>
          <Content>
            <ListView
              style={styles.container}
              enableEmptySections
              // onEndReached={type => this._retrieveNextPage(this.props.type)}
              onEndReachedThreshold={1200}
              dataSource={this.state.dataSource}
              renderRow={rowData => <CardThree order={rowData} viewOrder={this._viewOrder} />}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
              renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._onRefresh}
                  colors={['#EA0000']}
                  tintColor="white"
                  title="loading..."
                  titleColor="white"
                  progressBackgroundColor="white"
                />
              }
            />
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
