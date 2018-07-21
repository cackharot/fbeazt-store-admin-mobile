import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import { Icon, Button } from 'native-base';

class OrderStatusIcon extends Component {

    constructor(props) {
        super(props);
        this._getStatusIcon = this._getStatusIcon.bind(this);
    }

    _getStatusIcon(status, active, iconStyle) {
        const istyle = [styles.baseStyle, iconStyle];
        var content = null;
        switch (status) {
            case 'PREPARING':
                content = (<Icon name='ios-time' active={active} style={istyle} />);
                break;
            case 'PROGRESS':
                content = (<Icon name='ios-thumbs-up' active={active} style={istyle} />);
                break;
            case 'DELIVERED':
                content = (<Icon name='checkmark-circle' active={active} style={istyle} />);
                break;
            case 'PAID':
                content = (<Icon name='ios-cash' active={active} style={istyle} />);
                break;
            default:
            case 'PENDING':
                content = (<Icon name='ios-megaphone' active={active} style={istyle} />);
                break;
        }
        // if(active){
            // return (<Button transparent style={{alignSelf: 'flex-end', marginTop: 10}} rounded small>{content}</Button>);
        // }
        return content;
    }

    render() {
        const { status, asButton, iconStyle } = this.props;
        return this._getStatusIcon(status, asButton ? true : false, iconStyle);
    }
}

OrderStatusIcon.propTypes = {
    status: PropTypes.string.isRequired,
    iconStyle: PropTypes.number,
    asButton: PropTypes.bool
};

const styles = StyleSheet.create({
    baseStyle: {
        color: '#DE89D5'
    }
});

export default OrderStatusIcon;
