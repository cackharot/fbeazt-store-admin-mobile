import React, { Component } from 'react';
const { Navigation } = require('react-native-navigation');
import {
  View,
  Platform
} from 'react-native';
import moment from 'moment';
import { Container, Segment, Footer, Button, Right, Left, Header, Title, Body, Toast, Content, Icon, Text, ListItem, DatePicker, Separator, Radio, CheckBox } from 'native-base';

import { iconsMap } from '../appIcons';

class OrderListFilter extends Component {

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        this.state = {
            filter: props.filter
        };
        this.updateFilter = this.updateFilter.bind(this);
    }

    navigationButtonPressed({ buttonId }) {
        if(buttonId === 'orderListFilterBack') {
            Navigation.dismissModal(this.props.componentId);
        }
    }

    updateFilter(key, value) {
        const {filter} = this.state;
        filter[key] = value;
        this.setState({filter}, () => {
            if(this.props.update && this.props.update(filter));
        });
    }

    render() {
        const {filter} = this.state;
        return (
            <Container>
                <Content>
                    <ListItem>
                        <Left>
                            <Text>Show only today orders</Text>
                        </Left>
                        <Right>
                            <Radio selected={filter.only_today}  onPressOut={() => this.updateFilter('only_today', true) } />
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>Custom Date Range</Text>
                        </Left>
                        <Right>
                            <Radio selected={!filter.only_today} onPressOut={() => this.updateFilter('only_today', false) } />
                        </Right>
                    </ListItem>
                    {!filter.only_today && (
                        <View>
                            <Separator><Text>Date range</Text></Separator>
                            {this.renderDatePicker('Start Date','start_date',filter.start_date)}
                            {this.renderDatePicker('End Date','end_date',filter.end_date)}
                        </View>
                    )}
                </Content>
            </Container>
        );
    }

    renderDatePicker(title, key, value) {
        return (
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18}}>
                    <Text>{title}</Text>
                    <DatePicker
                        defaultDate={value}
                        minimumDate={moment().subtract(1, 'years').toDate()}
                        maximumDate={new Date()}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"default"}
                        textStyle={{ color: "grey" }}
                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                        onDateChange={(d) => this.updateFilter(key, d)}
                    />
                </View>
        );
    }
}

export default OrderListFilter;
