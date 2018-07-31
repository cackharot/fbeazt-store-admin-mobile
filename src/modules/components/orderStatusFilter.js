import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, TouchableOpacity, StyleSheet, View, ShadowPropTypesIOS } from 'react-native';
import { Badge, Icon, Button, Segment, FooterTab, Text } from 'native-base';
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
                CANCELLED: false
            },
            icons: {
                PENDING: 'megaphone',
                PREPARING: 'time',
                PROGRESS: 'thumbs-up',
                DELIVERED: 'checkmark-circle',
                PAID: 'cash',
                CANCELLED: 'remove-circle'
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

    _calCount(status) {
        let cnt = parseInt(this.props.statusCounts[status.toLowerCase()] || 0);
        if(status === 'DELIVERED'){
            let paid = parseInt(this.props.statusCounts['paid'] || 0);
            cnt = cnt + paid;
        }
        return cnt;
    }

    _getStatusIcon(status, text) {
        const count = this._calCount(status);
        const active = this.state.filter[status];
        const iconName = this.state.icons[status];
        var content = (
                <Button badge={count > 0} vertical active={active} onPressOut={this._onClick.bind(this, status)}>
                    {count > 0 && <Badge success><Text>{count}</Text></Badge>}
                    <Icon name={iconName} active={active}/>
                    <Text>{text}</Text>
                </Button>
        );
        return content;
   }

    render() {
        const { status, onChange } = this.props;
        return (
            <FooterTab>
                {this._getStatusIcon('PENDING', 'Received')}
                {this._getStatusIcon('PREPARING', 'Cooking')}
                {this._getStatusIcon('PROGRESS', 'Ready')}
                {this._getStatusIcon('DELIVERED', 'Done/Paid')}
            </FooterTab>
        );
    }
}

OrderStatusFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    statusCounts: PropTypes.object.isRequired
};

export default OrderStatusFilter;
