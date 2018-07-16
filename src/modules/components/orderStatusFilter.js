
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, TouchableOpacity, StyleSheet, View, ShadowPropTypesIOS } from 'react-native';
import { Icon, Button, Segment, Text } from 'native-base';
import moment from 'moment';

class OrderStatusFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: {
                PENDING: true,
                PREPARING: true,
                PROGRESS: true,
                DELIVERED: false,
                PAID: false,
                CANCELLED: false,
            }
        };
        this._onClick = this._onClick.bind(this);
        this._getStatusIcon = this._getStatusIcon.bind(this);
    }

    _onClick(filterStatus) {
        const { onChange } = this.props;
        var st = {};
        Object.assign(st, this.state.filter);
        st[filterStatus] = !st[filterStatus];
        this.setState({ filter: st }, () => {
            onChange(st);
        });
    }

    _getStatusIcon(status, text) {
        const istyle = [styles.segmentIcon];
        const textStyle = [styles.segmentTitle];
        const active = this.state.filter[status];
        var content = null;
        switch (status) {
            case 'PREPARING':
                content = (
                    <Button transparent active={active} onPressOut={this._onClick.bind(this, status)}>
                        <Icon name='time' active={active} style={istyle} />
                        <Text style={textStyle}>{text}</Text>
                    </Button>
                );
                break;
            case 'PROGRESS':
                content = (
                    <Button transparent active={active} onPressOut={this._onClick.bind(this, status)}>
                        <Icon name='thumbs-up' active={active} style={istyle} />
                        <Text style={textStyle}>{text}</Text>
                    </Button>
                );
                break;
            case 'DELIVERED':
                content = (
                    <Button transparent last active={active} onPressOut={this._onClick.bind(this, status)}>
                        <Icon name='checkmark-circle' active={active} style={istyle} />
                        <Text style={textStyle}>{text}</Text>
                    </Button>
                );
                break;
            case 'PAID':
                content = (
                    <Button transparent last active={active} onPressOut={this._onClick.bind(this, status)}>
                        <Icon name='cash' active={active} style={istyle} />
                        <Text style={textStyle}>{text}</Text>
                    </Button>
                );
                break;
            default:
            case 'PENDING':
                content = (
                    <Button transparent first active={active} onPressOut={this._onClick.bind(this, status)}>
                        <Icon name='megaphone' active={active} style={istyle} />
                        <Text style={textStyle}>{text}</Text>
                    </Button>
                );
                break;
        }
        return content;
    }

    render() {
        const { status, onChange } = this.props;
        return (
            <Segment style={styles.statusSegment}>
                {this._getStatusIcon('PENDING', 'Received')}
                {this._getStatusIcon('PREPARING', 'Cooking')}
                {this._getStatusIcon('PROGRESS', 'Ready')}
                {this._getStatusIcon('DELIVERED', 'Delivered')}
            </Segment>
        );
    }
}

OrderStatusFilter.propTypes = {
    // order: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    segmentIcon: {
        marginLeft: 0,
        marginRight: 0,
        color: 'white',
        paddingHorizontal: 6,
    },
    btnStatus: {
        // flex: 1,
        // alignItems: 'center',
    },
    segmentTitle: {
        fontSize: 13,
        paddingRight: 8,
        paddingLeft: 8,
        color: 'white'
    },
    statusSegment: {
        backgroundColor: '#6566A0'
    },
});

export default OrderStatusFilter;
