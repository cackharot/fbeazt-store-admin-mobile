import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    Linking,
    RefreshControl,
    ScrollView,
    Text,
    ToastAndroid,
    View
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import { Container, Segment, Button, Right, Left, Header, Title, Body, Content, Icon } from 'native-base';
import * as ordersListActions from '../actions/ordersListActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles/orders';

import CardTwo from './components/cardTwo';
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

        return (
            this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
                <Container>
                    <Content contentContainerStyle={{ flexBasis: '100%' }}>
                        <ScrollView
                            style={styles.container}
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
                            }>
                            <Text>{order.order_no}</Text>
                        </ScrollView>
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
