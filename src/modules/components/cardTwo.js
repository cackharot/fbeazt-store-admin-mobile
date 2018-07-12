import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import {
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

class CardTwo extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { order, viewOrder } = this.props;
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={viewOrder.bind(this, order.order_id.$oid)}>
                <View style={styles.cardContainer}>
                    <View style={styles.cardTitleContainer}>
                        <Text style={styles.cardTitle} numberOfLines={2}>
                            {order.store_order_no}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

CardTwo.propTypes = {
    order: PropTypes.object.isRequired,
    viewOrder: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    cardContainer: {
        height: 231,
        width: 135,
        backgroundColor: 'white',
        flexDirection: 'column',
        marginRight: 10,
        borderRadius: 3
    },
    cardImage: {
        width: 135,
        height: 184,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    },
    cardTitleContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    cardTitle: {
        color: 'black',
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: 1
    }
});

export default CardTwo;
