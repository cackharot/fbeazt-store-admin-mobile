import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';
import {
    ImageBackground,
    RefreshControl,
    ScrollView,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Container, Text, Button, Right, Left, Body, Content, Icon } from 'native-base';
import { Root, Badge, Toast, Card, CardItem, List, ListItem, Separator, Segment } from 'native-base';
import * as reportActions from '../actions/reportActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles/orders';
import moment from 'moment';
import { iconsMap } from '../appIcons';
import OrderStatusIcon from './components/orderStatusIcon';
import StatusTimeline from './components/statusTimeline';
import ProgressBar from './components/progressBar';

import { VictoryBar, VictoryArea, VictoryPie, VictoryChart, VictoryStack, VictoryTheme } from "victory-native";

class ReportScreen extends Component {
    // static get options() {
    //     return {
    //         topBar: {
    //             rightButtons: {
    //                 id: 'reportsRefreshButton',
    //                 icon: iconsMap['ios-refresh']
    //             }
    //         }
    //     };
    // }

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        const d = moment().utc().local(true);
        this.state = {
            isLoading: true,
            categories: ['Total', 'Paid', 'Delivered', 'Cancelled'],
            reports: [
                this._fmtMonth(null, null),
                this._fmtMonth(null, null),
                this._fmtMonth(null, null),
                this._fmtMonth(null, null)
            ],
            query: {
                year: d.year()
            },
            today: { statusCounts: {}, statusAmounts: {} },
            outstanding: { statusCounts: {}, statusAmounts: {} },
            statusCountsParams: {
                year: d.year(),
                month: d.month() + 1,
                day: d.date()
            },
            outstandingParams: {year: 0, month: 0, day: 0}
        };
    }

    navigationButtonPressed({ buttonId }) {
        if(buttonId === 'reportsRefreshButton') {
            this.setState({isLoading: true});
            this._retrieveReports();
        }
    }

    async componentWillMount() {
        const store = await storage.load({key: 'userStore', autoSync: false, syncInBackgroud: false});
        await this.setState({store: store, storeId : store._id.$oid});
        await this._retrieveReports();
    }

    _fmtMonth(data, status_key) {
        const total = [];
        for (let i = 1; i <= 12; ++i) {
            let y = 0;
            if (data && data[status_key]) {
                y = data[status_key][i.toString()] || 0;
            }
            total.push({x: i.toString(), y: y});
        }
        return total;
    }

    async _retrieveReports() {
        const {storeId, query, statusCountsParams, outstandingParams} = this.state;

        const screq = this.props.actions.getReports(storeId, statusCountsParams);
        const osreq  = this.props.actions.getOutstandingReports(storeId, outstandingParams);
        const otreq = this.props.actions.orderTrends(storeId, query);

        await Promise.all([screq, osreq, otreq]);

        this.setState({isLoading: false});
        this.applyOrderTrends();
        this.applyStatusCounts();
        this.applyOutstanding();
    }

    applyOutstanding() {
        const sc = this.props.outstanding;
        this.setState({outstanding: {statusCounts: sc, statusAmounts: sc.amounts}});
    }

    applyStatusCounts() {
        const sc = this.props.today;
        this.setState({today: {statusCounts: sc, statusAmounts: sc.amounts}});
    }

    applyOrderTrends() {
        const {reports} = this.state;
        const res =  this.props.orderTrends;
        if(res && res.error){
            console.log(`${res.error}`);
            this.setState({error: res.error});
        } else {
            reports[1] = this._fmtMonth(res, 'paid');
            reports[2] = this._fmtMonth(res, 'delivered');
            reports[3] = this._fmtMonth(res, 'cancelled');
            reports[0] = reports[1].map((num, idx) => {
                let y = num.y + reports[2][idx].y + reports[3][idx].y;
                return {x: idx.toString(), y: y};
            });
            this.setState({
                reports: reports
            });
        }
    }

    renderOrderTrends() {
        const { categories, reports, query } = this.state;
        return (
            <View>
                <Separator>
                    <Text>Order trends for {query.year}</Text>
                </Separator>
                <VictoryChart width={450} theme={VictoryTheme.material}>
                    <VictoryStack >
                        <VictoryArea data={reports[0]} />
                        <VictoryArea data={reports[1]} />
                        <VictoryArea data={reports[2]} />
                        <VictoryArea data={reports[3]} />
                    </VictoryStack>
                </VictoryChart>
            </View>);
    }

    renderReport(title, reportData) {
        const { statusCounts, statusAmounts } = reportData;
        const paid = statusCounts['paid'] || 0;
        const paidAmt = statusAmounts['paid'] || 0;
        const unpaid = statusCounts['delivered'] || 0;
        const unpaidAmt = statusAmounts['delivered'] || 0;
        const cancelled = statusCounts['cancelled'] || 0;
        const cancelledAmt = statusAmounts['cancelled'] || 0;
        const total = paid+unpaid+cancelled;
        const totalAmt = paidAmt+unpaidAmt+cancelledAmt;
        const data = [
            {icon: 'done-all', color: '#2181F7', key: 'Total', value: total, amt: totalAmt},
            {icon: 'cash', color: '#5CB85C', key: 'Paid', value: paid, amt: paidAmt},
            {icon: 'mail-open', color: '#F7403D', key: 'Unpaid', value: unpaid, amt: unpaidAmt},
            {icon: 'remove-circle', color: '#8F8E93', key: 'Cancelled', value: cancelled, amt: cancelledAmt},
        ];
        return (
                <View>
                    <Separator>
                        <Text>{title}</Text>
                    </Separator>
                    <View>
                        <List noIndent dataArray={data}
                            renderRow={(item) =>
                            <ListItem noIndent icon style={{paddingLeft: 6}}>
                                    <Left>
                                        <Button transparent>
                                            <Badge style={{backgroundColor: item.color}}>
                                                <Text>{parseInt(item.value).toFixed(0)}</Text>
                                            </Badge>
                                        </Button>
                                    </Left>
                                    <Body>
                                        <Text>{item.key}</Text>
                                    </Body>
                                    <Right>
                                        <Text note>₹{parseFloat(item.amt).toFixed(2)}</Text>
                                    </Right>
                            </ListItem>
                            }>
                    </List>
                    </View>
                </View>);
    }

    render() {
        const { categories, reports, query } = this.state;
        return (
            this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
                <Root>
                    <Container>
                        <Content>
            {this.renderReport('Today', this.state.today)}
            {this.renderReport('Outstanding', this.state.outstanding)}
            {this.renderOrderTrends()}
                        </Content>
                    </Container>
                </Root>
        );
    }
}

ReportScreen.propTypes = {
    // storeOrderId: PropTypes.string.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        today: state.reports.today,
        outstanding: state.reports.outstanding,
        orderTrends: state.reports.orderTrends
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(reportActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { "withRef": true })(ReportScreen);
