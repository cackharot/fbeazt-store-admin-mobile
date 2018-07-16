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
            isRefreshing: false,
            order: {}
        };
        this._onRefresh = this._onRefresh.bind(this);
        this._updateOrderStatus = this._updateOrderStatus.bind(this);
        this._showMessage = this._showMessage.bind(this);
    }

    componentWillMount() {
        this._retrieveDetails();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.order) this.setState({ isLoading: false });
    }

    _retrieveDetails(isRefreshed) {
        this.props.actions.retrieveOrderDetails(this.props.storeOrderId)
            .then(() => {
            });
        if (isRefreshed && this.setState({ isRefreshing: false }));
    }

    _onRefresh() {
        this.setState({ isRefreshing: true });
        this._retrieveDetails(true);
    }

    _onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'close') {
                this.props.navigator.dismissModal();
            }
        }
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
                    this._retrieveDetails(true);
                });
        }
    }

    render() {
        const iconStar = <Icon name="md-star" size={16} color="#F5B642" />;
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
                                        <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
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
                            <StatusTimeline order={order} onClick={this._updateOrderStatus} />
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
        updateOrderStatus: state.storeOrders.updateOrderStatus
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ordersListActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { "withRef": true })(OrderDetails);
