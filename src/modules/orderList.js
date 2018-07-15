import React, { Component } from 'react';
import PropTypes from 'prop-types';
const { Navigation } = require('react-native-navigation');
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ListView,
  Platform
} from 'react-native';
import { Root } from "native-base";
import { Container, Segment, Button, Right, Left, Header, Title, Body, Toast, Content, Icon } from 'native-base';
import * as ordersListActions from '../actions/ordersListActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles/orders';

import OrderStatusIcon from './components/orderStatusIcon';
import CardThree from './components/cardThree';
import ProgressBar from './components/progressBar';

class OrderListComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      isLoading: true,
      isRefreshing: false,
      showToast: false
    };

    this._viewOrder = this._viewOrder.bind(this);
    this._updateOrderStatus = this._updateOrderStatus.bind(this);
    this._showMessage = this._showMessage.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentWillMount() {
    this._retrieveOrders();
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.storeOrders) this.setState({ isLoading: false });
  }

  _showMessage(nextStatus, response) {
    if (response.status === "error") {
      console.log(`Update failed order status to ${nextStatus}`);
      Toast.show({
        text: `Cannot update status to ${nextStatus}`,
        duration: 3000,
        type: "danger"
      });
    } else {
      Toast.show({
        text: `Updated status to ${nextStatus}`,
        duration: 3000,
        type: "success"
      });
    }
  }

  _viewOrder(storeOrderId) {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'app.orderDetails',
        passProps: {
          storeOrderId
        },
        options: {
          topBar: {
            title: {
              text: `Order Details`
            }
          }
        }
      }
    });
  }

  _updateOrderStatus(storeOrderId, currentStatus, nextStatus) {
    if (currentStatus === nextStatus) {
      Toast.show({
        text: "Already updated!",
        buttonText: "Okay",
        type: "warning"
      });
    } else {
      console.log(`Updating order ${storeOrderId} status to ${nextStatus}`);
      this.props.actions.updateOrderStatus(storeOrderId, nextStatus)
        .then(() => {
          this._showMessage(nextStatus, this.props.updateOrderStatus);
          this._retrieveOrders(true);
        });
    }
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
        // this._viewOrder(this.props.storeOrders.items[2]._id.$oid);
      });
    if (isRefreshed && this.setState({ isRefreshing: false }));
  }

  render() {
    return (
      this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
        <Root>
          <Container>
            <Segment style={styles.statusSegment}>
              <Button transparent first active>
                <Icon name='megaphone' style={styles.segmentIcon} />
                <Text style={styles.segmentTitle}>Pending</Text>
              </Button>
              <Button active>
                <Icon name='time' style={styles.segmentIcon} />
                <Text style={styles.segmentTitle}>Cooking</Text>
              </Button>
              <Button active={false}>
                <Icon name='thumbs-up' style={styles.segmentIcon} />
                <Text style={styles.segmentTitle}>Ready</Text>
              </Button>
              <Button last>
                <Icon name='checkmark-circle' style={styles.segmentIcon} />
                <Text style={styles.segmentTitle}>Delivered</Text>
              </Button>
            </Segment>
            <Content contentContainerStyle={{ flexBasis: '100%' }}>
              <ListView
                style={styles.container}
                enableEmptySections
                // onEndReached={type => this._retrieveNextPage(this.props.type)}
                onEndReachedThreshold={1200}
                dataSource={this.state.dataSource}
                renderRow={rowData => <CardThree order={rowData} viewOrder={this._viewOrder} updateOrderStatus={this._updateOrderStatus} />}
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
        </Root>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    storeOrders: state.storeOrders.list,
    updateOrderStatus: state.storeOrders.updateOrderStatus
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ordersListActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { "withRef": true })(OrderListComponent);
