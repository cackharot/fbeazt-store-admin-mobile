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
import { Badge, Card, CardItem, List, ListItem, Separator } from 'native-base';
import * as ordersListActions from '../actions/ordersListActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles/orders';
import moment from 'moment';
import { iconsMap } from '../appIcons';
import ProgressBar from './components/progressBar';


class OrderDetailsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isRefreshing: false,
            order: {}
        };
        this._onRefresh = this._onRefresh.bind(this);
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
                <Container>
                    <Content padder={false}>
                        <View>
                            <ImageBackground source={require('../images/detail_bg.jpg')} style={styles.imageBackdrop} >
                                <View style={styles.detailHeaderContainer}>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                            <Icon name='megaphone' style={styles.statusIcon} active />
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
                        <CardItem>
                            <Left>
                                <Button transparent>
                                    <Icon active name="thumbs-up" />
                                    <Text>12 Likes</Text>
                                </Button>
                            </Left>
                            <Body>
                                <Button transparent>
                                    <Icon active name="chatbubbles" />
                                    <Text>4 Comments</Text>
                                </Button>
                            </Body>
                            <Right>
                                <Text>11h ago</Text>
                            </Right>
                        </CardItem>
                    </Content>
                </Container>
        );
    }
}

OrderDetailsComponent.propTypes = {
    storeOrderId: PropTypes.string.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        order: state.storeOrders.details
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ordersListActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { "withRef": true })(OrderDetailsComponent);
