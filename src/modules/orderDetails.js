import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    ImageBackground,
    RefreshControl,
    ScrollView,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Container, Text, Button, Right, Left, Body, Content, Icon } from 'native-base';
import { Root, Badge, Toast, Card, CardItem, List, ListItem, Separator, Segment } from 'native-base';
import * as ordersListActions from '../actions/ordersListActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles/orders';
import moment from 'moment';
import { iconsMap } from '../appIcons';
import OrderStatusIcon from './components/orderStatusIcon';
import StatusTimeline from './components/statusTimeline';
import ProgressBar from './components/progressBar';


class OrderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            order: {}
        };
        this._updateOrderStatus = this._updateOrderStatus.bind(this);
        this._showMessage = this._showMessage.bind(this);
    }

    async componentWillMount() {
        const store = await storage.load({key: 'userStore', autoSync: false, syncInBackgroud: false});
        this.setState({store: store}, ()=> {
            this._retrieveDetails();
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.order) this.setState({ isLoading: false });
    }

    _retrieveDetails() {
        const {store} = this.state;
        const storeId = store._id.$oid;
        this.props.actions.retrieveOrderDetails(storeId, this.props.storeOrderId);
    }

    _showMessage(nextStatus, response) {
        const displayNames = {
            PENDING: 'Received',
            PREPARING: 'Cooking',
            PROGRESS: 'Ready',
            DELIVERED: 'Delivered',
            PAID: 'Paid',
            CANCELLED: 'Cancelled'
        };
        const statusName = displayNames[nextStatus] || nextStatus;
        if (response.status === "error") {
            console.log(`Update failed order status to ${statusName}`);
            Toast.show({
                text: `${response.message || 'Cannot change status'}`,
                duration: 3000,
                type: "danger"
            });
        } else {
            Toast.show({
                text: `Updated status to ${statusName}`,
                duration: 3000,
                type: "success"
            });
        }
    }

    _updateOrderStatus(storeOrderId, currentStatus, nextStatus) {
        if(currentStatus === 'PAID'){
            Toast.show({
                text: 'Already PAID!',
                type: 'warning'
            });
            return;
        }
        if (currentStatus === nextStatus) {
            Toast.show({
                text: "Already updated!",
                type: "warning"
            });
            return;
        }
        if(currentStatus === 'DELIVERED' && nextStatus !== 'PAID'){
            Toast.show({
                text: 'Already PICKED. Cannot change!',
                type: 'warning'
            });
            return;
        }
        console.log(`Updating order ${storeOrderId} status to ${nextStatus}`);
        const {store} = this.state;
        const storeId = store._id.$oid;
        this.props.actions.updateOrderStatus(storeId, storeOrderId, nextStatus)
            .then(() => {
                this._showMessage(nextStatus, this.props.updateStatusResponse);
                this._retrieveDetails(true);
            });
    }

    statusTimings(order, status) {
        if(order.status_timings && order.status_timings[status]) {
            const d = moment(order.status_timings[status].$date).utc();
            return d.local(true).fromNow();
        }
        return 'NA';
    }

    render() {
        const { order } = this.props;
        var orderDate, dateStr;
        if (order && order.created_at) {
            orderDate = moment(order.created_at.$date).utc();
            dateStr = orderDate.local(true).fromNow();
        }
        return (
            this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
                <Root>
                    <Container>
                        <Content>
                            <View>
                                <ImageBackground source={require('../images/detail_bg.jpg')} style={styles.imageBackdrop} >
                                    <View style={styles.detailHeaderContainer}>
                                        <View>
                                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                <OrderStatusIcon asButton status={order.status} iconStyle={styles.statusIcon} />
                                                <Text style={styles.orderno}>#{order.store_order_no.toUpperCase()}</Text>
                                            </View>
                                            <View style={{ paddingLeft: 38 }}>
                                                <Text style={styles.orderitems}>{order.items.length} items</Text>
                                                <Text style={styles.timeago}>{orderDate.format('DD/MM/YYYY LT')} ({dateStr})</Text>
                                            </View>
                                        </View>
                <View style={{ alignSelf: 'flex-start' }}>
                                            <Text style={styles.orderTotal}>₹{order.total}</Text>
                                        </View>
                                    </View>
                                </ImageBackground>
                                {/* <LinearGradient colors={['rgba(0, 0, 0, 0.2)', 'rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.7)']} style={styles.linearGradient} /> */}
                            </View>
                            <Separator>
                                <Text>ITEMS</Text>
                            </Separator>
                            <View>
                                <List noIndent dataArray={order.items}
                                    renderRow={(item) =>
                                        <ListItem noIndent>
                                            <Body>
                                                <Text>{item.name}</Text>
                                                {item.price_detail && item.price_detail.price > 0.0 && (
                                                    <Text>{item.price_detail.description}</Text>
                                                )}
                                            </Body>
                                            <Right>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text note>{item.price}x </Text>
                                                    <Badge primary>
                                                        <Text>{item.quantity}</Text>
                                                    </Badge>
                                                </View>
                                                <Text>{item.total}</Text>
                                            </Right>
                                        </ListItem>
                                    }>
                                </List>
                            </View>
                            {order.status !== 'CANCELLED' && (
                               <StatusTimeline order={order} onClick={this._updateOrderStatus} />
                            )}
                            {order.status === 'PAID' && (
                            <View style={styles.statusNote}>
                                <Text note>PAID successfully by Foodbeazt at {this.statusTimings(order, 'PAID')}</Text>
                            </View>
                            )}
                            {order.status === 'CANCELLED' && (
                            <View style={styles.statusNote}>
                                <Text note>
                                    CANCELLED by Foodbeazt at {this.statusTimings(order, 'PAID')}
                                </Text>
                            </View>
                            )}
                        </Content>
                    </Container>
                </Root>
        );
    }
}

OrderDetails.propTypes = {
    storeOrderId: PropTypes.string.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        order: state.storeOrders.details,
        updateStatusResponse: state.storeOrders.updateOrderStatus
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ordersListActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { "withRef": true })(OrderDetails);
