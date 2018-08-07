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
import moment from 'moment';
import { Container, Segment, Footer, Button, Right, Left, Header, Title, Body, Toast, Content, Icon } from 'native-base';
import * as ordersListActions from '../actions/ordersListActions';
import * as reportsActions from '../actions/reportActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const timer = require('react-native-timer');
import Config from '../appConfig';

import styles from './styles/orders';
import { iconsMap } from '../appIcons';

import OrderStatusFilter from './components/orderStatusFilter';
import CardThree from './components/cardThree';
import ProgressBar from './components/progressBar';

class OrderList extends Component {
    static get options() {
        if(Platform.OS === 'ios') {
            return {};
        }
        return {
            topBar: {
                visible: false,
                drawBehind: true
            }
        };
    }

    constructor(props) {
        super(props);
        const d = moment().utc().local(true);
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
            },
            statusCounts: {},
            statusCountsParams:{
                year: d.year(),
                month: d.month() + 1,
                day: d.date()
            }
        };

        this._viewOrder = this._viewOrder.bind(this);
        this._onFilterChange = this._onFilterChange.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    async componentWillMount() {
        const store = await storage.load({key: 'userStore', autoSync: false, syncInBackgroud: false});
        const storeId = store._id.$oid;
        await this.setState({store: store, storeId});
        await this._retrieveOrders();
        if(!timer.intervalExists('loadOrders')) {
            timer.setInterval(this, 'loadOrders', () => {
                console.log(`Fetching orders from timer ${Config.REFRESH_INTERVAL}`);
                this._retrieveOrders();
            }, parseInt(Config.REFRESH_INTERVAL) * 60 * 1000);
        }
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

    async _onFilterChange(filter) {
        await this.setState({ isRefreshing: true, filter: filter });
        await this._retrieveOrders(true);
    }

    async _retrieveOrders(isRefreshed) {
        const { storeId, filter, statusCountsParams } = this.state;
        const orderListRequest = this.props.actions.retrieveOrders(storeId, filter);
        const reportsRequest = this.props.reportsActions.getReports(storeId, statusCountsParams);
        await Promise.all([orderListRequest, reportsRequest]);

        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        const dataSource = ds.cloneWithRows(this.props.storeOrders.items || []);
        this.setState({
            statusCounts: this.props.reports,
            list: this.props.storeOrders,
            dataSource,
            isLoading: false
        });
        // this._viewOrder(this.props.storeOrders.items[2]._id.$oid);
        if (isRefreshed) {
            this.setState({ isRefreshing: false });
        }
    }

    _retrieveNextPage() {
    }

    render() {
        const {statusCounts} = this.state;
        return (
        this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
            <Root>
            <Container>
                <Footer>
                <OrderStatusFilter statusCounts={statusCounts} onChange={this._onFilterChange} />
                </Footer>
                <Content contentContainerStyle={{ flexBasis: '100%' }}>
                <ListView
                    style={styles.container}
                    enableEmptySections
                    onEndReached={type => this._retrieveNextPage()}
                    onEndReachedThreshold={1200}
                    dataSource={this.state.dataSource}
                    renderRow={rowData => <CardThree order={rowData} viewOrder={this._viewOrder} />}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
                    renderFooter={() => <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}><Text note>Pull down to refresh</Text></View>}
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
      reports: state.reports.today
  };
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(ordersListActions, dispatch),
      reportsActions: bindActionCreators(reportsActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { "withRef": true })(OrderList);
