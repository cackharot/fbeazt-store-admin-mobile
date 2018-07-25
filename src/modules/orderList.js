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
const timer = require('react-native-timer');
import Config from '../appConfig';

import styles from './styles/orders';

import OrderStatusFilter from './components/orderStatusFilter';
import CardThree from './components/cardThree';
import ProgressBar from './components/progressBar';

class OrderList extends Component {

    constructor(props) {
        super(props);
        this.state = {
        list: [],
        isLoading: true,
        isRefreshing: false,
        showToast: false,
        filter: {
            PENDING: true,
            PREPARING: true,
            PROGRESS: true,
            DELIVERED: false,
            PAID: false,
            CANCELLED: false
        }
        };

        this._viewOrder = this._viewOrder.bind(this);
        this._onFilterChange = this._onFilterChange.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    componentWillMount() {
        this._retrieveOrders();
        timer.setInterval(this, 'loadOrders', () => {
            console.log(`Fetching orders from timer ${Config.REFRESH_INTERVAL}`);
            this._retrieveOrders();
        }, parseInt(Config.REFRESH_INTERVAL) * 60 * 1000);
    }

    componentWillUnmount() {
        timer.clearInterval(this);
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.storeOrders) this.setState({ isLoading: false });
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

    _onRefresh() {
        this.setState({ isRefreshing: true });
        this._retrieveOrders(true);
    }

    _onFilterChange(filter) {
        this.setState({ isRefreshing: true, filter: filter }, () => {
            this._retrieveOrders(true);
        });
    }

    _retrieveOrders(isRefreshed) {
        const { filter } = this.state;
        this.props.actions.retrieveOrders(filter)
        .then(() => {
            const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
            const dataSource = ds.cloneWithRows(this.props.storeOrders.items || []);
            this.setState({
                list: this.props.storeOrders,
                dataSource,
                isLoading: false
            });
            // this._viewOrder(this.props.storeOrders.items[2]._id.$oid);
        });
        if (isRefreshed) {
            this.setState({ isRefreshing: false });
        }
    }

    _retrieveNextPage() {
    }

    render() {
        return (
        this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
            <Root>
            <Container>
                <OrderStatusFilter onChange={this._onFilterChange} />
                <Content contentContainerStyle={{ flexBasis: '100%' }}>
                <ListView
                    style={styles.container}
                    enableEmptySections
                    onEndReached={type => this._retrieveNextPage()}
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
            </Root>
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

export default connect(mapStateToProps, mapDispatchToProps, null, { "withRef": true })(OrderList);
