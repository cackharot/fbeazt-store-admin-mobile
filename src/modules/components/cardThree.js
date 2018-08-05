import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import {
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { iconsMap } from '../../appIcons';
import OrderStatusIcon from './orderStatusIcon';
import moment from 'moment';

class CardThree extends Component {

    constructor(props) {
        super(props);
    }

    _getNextStatus(current) {
        switch (current) {
            case 'PREPARING':
                return 'PROGRESS';
            case 'PROGRESS':
                return 'PROGRESS';
            case 'DELIVERED':
                return 'DELIVERED';
            case 'PAID':
                return 'PAID';
            default:
            case 'PENDING':
                return 'PREPARING';
        }
    }

    render() {
        const { order, viewOrder } = this.props;
        const orderDate = moment(order.created_at.$date).utc();
        const dateStr = orderDate.local(true).fromNow();
        const nextStatus = this._getNextStatus(order.status);

        return (
            <TouchableOpacity activeOpacity={0.8} onPress={viewOrder.bind(this, order._id.$oid)}>
                <View style={styles.cardContainer}>
                    <View style={styles.leftContent}>
                        <View style={{ flexDirection: 'row' }}>
                            <OrderStatusIcon status={order.status} iconStyle={styles.statusIcon}/>
                            <Text style={styles.timeago}>{dateStr}</Text>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.dateStr}>{orderDate.format('DD/MM/YY LT')}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.tw}>
                                    {order.items.length} items and {this._getQuantity(order)} quantity
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rightContent}>
                        <Text style={styles.total}>₹{order.payable.toFixed(2)}</Text>
                        <Text style={styles.listHeadingRight}>{order.store_order_no}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    _getQuantity(order) {
        return order.items.map(x => x.quantity).reduce((a, b) => a + b);
    }
}

// {nextStatus !== order.status &&
// <TouchableOpacity activeOpacity={0.6} onPress={updateOrderStatus.bind(this, order._id.$oid, order.status, nextStatus)}>
//     <OrderStatusIcon status={nextStatus} asButton={true} iconStyle={styles.buttonIcon}/>
// </TouchableOpacity>
// }

CardThree.propTypes = {
    order: PropTypes.object.isRequired,
    viewOrder: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    cardContainer: {
        height: 111,
        // width: 135,
        backgroundColor: '#4F4D8D',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        marginRight: 10,
        marginLeft: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 5
    },
    cardImage: {
        width: 135,
        height: 184,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    },
    buttonIcon: {
        fontSize: 23,
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    cartIcon: {
        color: 'white',
        fontSize: 18,
        marginRight: 10
    },
    statusIcon: {
        color: '#4FCBC6',
        fontSize: 24
    },
    leftContent: {
        flex: 1,
        alignItems: 'flex-start',
    },
    rightContent: {
        flex: 0.7,
    },
    listHeadingRight: {
        alignSelf: 'flex-end',
        color: 'white',
        fontWeight: '100',
        fontSize: 14
    },
    timeago: {
        paddingLeft: 10,
        color: 'white',
        alignSelf: 'center',
        fontWeight: '300',
        ...Platform.select({
            ios: {
                fontSize: 14
            },
            android: {
                fontSize: 15
            }
        })
    },
    total: {
        alignSelf: 'flex-end',
        color: 'white',
        fontWeight: '800',
        fontSize: 27
    },
    dateStr: {
        paddingVertical: 5,
        fontWeight: '300',
        color: 'white'
    },
    tw: {
        color: 'white',
        paddingVertical: 3
    }
});

export default CardThree;
