import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Icon, Button, Segment, Text } from 'native-base';
import moment from 'moment';

class StatusTimeline extends Component {

    constructor(props) {
        super(props);
        this._getStatusIcon = this._getStatusIcon.bind(this);
        this._getTimeStr = this._getTimeStr.bind(this);
    }

    _getTimeStr(order, status) {
        const { status_timings } = order;
        if (status_timings && status_timings[status]) {
            const stTime = status_timings[status].$date;
            return moment(stTime).utc().format('LT');
        }
        return "  ";
    }

    _getStatusIcon(order, status, active, text, onClick) {
        const istyle = [styles.baseStyle];
        const textStyle = [styles.btnStatusText];
        if (active) {
            istyle.push(styles.activeColor);
            textStyle.push(styles.activeColor);
        }
        var content = null;
        switch (status) {
            case 'PREPARING':
                content = (
                    <TouchableOpacity style={styles.btnStatus} activeOpacity={0.6} onPress={onClick.bind(this, order._id.$oid, order.status, 'PREPARING')}>
                        <Text style={textStyle}>{text}</Text>
                        <Icon name='time' active={active} style={istyle} />
                        <Text style={textStyle}>{this._getTimeStr(order, 'PREPARING')}</Text>
                    </TouchableOpacity>
                );
                break;
            case 'PROGRESS':
                content = (
                    <TouchableOpacity style={styles.btnStatus} activeOpacity={0.6} onPress={onClick.bind(this, order._id.$oid, order.status, 'PROGRESS')}>
                        <Text style={textStyle}>{text}</Text>
                        <Icon name='thumbs-up' active={active} style={istyle} />
                        <Text style={textStyle}>{this._getTimeStr(order, 'PROGRESS')}</Text>
                    </TouchableOpacity>
                );
                break;
            case 'DELIVERED':
                content = (
                    <TouchableOpacity style={styles.btnStatus} activeOpacity={0.6}>
                        <Text style={textStyle}>{text}</Text>
                        <Icon name='checkmark-circle' active={active} style={istyle} />
                        <Text style={textStyle}>{this._getTimeStr(order, 'DELIVERED')}</Text>
                    </TouchableOpacity>
                );
                break;
            case 'PAID':
                content = (
                    <TouchableOpacity style={styles.btnStatus} activeOpacity={0.6}>
                        <Text style={textStyle}>{text}</Text>
                        <Icon name='cash' active={active} style={istyle} />
                        <Text style={textStyle}>{this._getTimeStr(order, 'PAID')}</Text>
                    </TouchableOpacity>
                );
                break;
            default:
            case 'PENDING':
                content = (
                    <TouchableOpacity style={styles.btnStatus} activeOpacity={0.6}>
                        <Text style={textStyle}>Received</Text>
                        <Icon name='megaphone' active={active} style={istyle} />
                        <Text style={textStyle}>{this._getTimeStr(order, 'PENDING')}</Text>
                    </TouchableOpacity>
                );
                break;
        }
        // if(active){
        // return (<Button transparent style={{alignSelf: 'flex-end', marginTop: 10}} rounded small>{content}</Button>);
        // }
        return content;
    }

    render() {
        const { order, onClick } = this.props;
        const status = order.status;
        return (
            <Segment style={styles.detailStatusActions}>
                {this._getStatusIcon(order, 'PENDING', 'PENDING' === status, 'Received', onClick)}
                {this._getStatusIcon(order, 'PREPARING', 'PREPARING' === status, 'Cooking', onClick)}
                {this._getStatusIcon(order, 'PROGRESS', 'PROGRESS' === status, 'Ready', onClick)}
                {this._getStatusIcon(order, 'DELIVERED', 'DELIVERED' === status, 'Delivered', onClick)}
            </Segment>
        );
    }
}

StatusTimeline.propTypes = {
    order: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    baseStyle: {
        color: '#6566A0',
        margin: 0,
        padding: 0,
    },
    activeColor: {
        color: '#DE89D5'
    },
    btnStatus: {
        flex: 1,
        alignItems: 'center',
    },
    btnStatusText: {
        fontSize: 14,
        color: '#999',
    },
    segmentTitle: {
        fontSize: 13,
        paddingRight: 8,
    },
    detailStatusActions: {
        height: 60,
        marginTop: 20,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
});

export default StatusTimeline;
