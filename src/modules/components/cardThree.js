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
import moment from 'moment';

class CardThree extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { order, viewOrder } = this.props;
        const orderDate = moment(order.created_at.$date).utc();
        const dateStr = orderDate.local(true).fromNow();
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={viewOrder.bind(this, order.order_id.$oid)}>
                <View style={styles.cardContainer}>
                    <View style={styles.leftContent}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                            <Icon name='megaphone' style={styles.statusIcon} />
                            <Text style={styles.timeago}>{dateStr}</Text>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.dateStr}>{orderDate.format('DD/MM/YY LT')}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                {/* <Icon ios='ios-cart' name='cart' style={styles.cartIcon} /> */}
                                <Text style={styles.tw}>
                                    {order.items.length} items and {this._getQuantity(order)} quantity
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={styles.total}>₹{order.total}</Text>
                        <Text style={styles.listHeadingRight}>{order.store_order_no}</Text>
                        <TouchableOpacity activeOpacity={0.6} onPress={viewOrder.bind(this, order.order_id.$oid)}>
                            <Icon name='time' style={styles.timeIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    _getQuantity(order) {
        return order.items.map(x => x.quantity).reduce((a, b) => a + b)
    }
}

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
        // marginTop: 22,
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
    timeIcon: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignSelf: 'center',
        color: '#EF3867',
        fontSize: 33,
        fontWeight: 'bold'
    },
    cartIcon: {
        color: 'white',
        fontSize: 18,
        marginRight: 10
    },
    statusIcon: {
        color: '#4FCBC6',
        fontSize: 24,
        marginRight: 10
    },
    leftContent: {
        paddingTop: 5,
        flexDirection: 'column',
    },
    listHeadingRight: {
        alignSelf: 'flex-end',
        color: 'white',
        fontWeight: '100',
        fontSize: 14
    },
    timeago: {
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
    content: {
    },
    tw: {
        color: 'white',
        // paddingHorizontal: 10,
        paddingVertical: 3
    }
});

export default CardThree;
