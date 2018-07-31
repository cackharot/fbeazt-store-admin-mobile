import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    constructor(props) {
        super(props);
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
            statusCounts: {},
            statusCountsParams:{
                year: d.year(),
                month: d.month() + 1,
                day: d.date()
            }
        };
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
        const {storeId, query, statusCountsParams} = this.state;

        const screq = this.props.actions.getReports(storeId, statusCountsParams);
        const otreq = this.props.actions.orderTrends(storeId, query);

        await Promise.all([screq, otreq]);

        this.setState({isLoading: false});
        this.applyOrderTrends();
        this.applyStatusCounts();
    }

    applyStatusCounts() {
        const sc = this.props.statusCounts;
        this.setState({statusCounts: sc});
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

    renderTodayReport() {
        const { statusCounts } = this.state;
        const paid = statusCounts['paid'] || 0;
        const unpaid = statusCounts['delivered'] || 0;
        const cancelled = statusCounts['cancelled'] || 0;
        const total = paid+unpaid+cancelled;
        const data = [
            {key: 'Total', value: total},
            {key: 'Paid', value: paid},
            {key: 'Unpaid', value: unpaid},
            {key: 'Cancelled', value: cancelled},
        ];
        return (
                <View>
                <Separator>
                <Text>Today</Text>
                </Separator>
                <View>
                <List noIndent dataArray={data}
            renderRow={(item) =>
                       <ListItem noIndent>
                       <Body>
                       <Text>{item.key}</Text>
                       </Body>
                       <Right>
                       <Text note>{parseInt(item.value).toFixed(0)}</Text>
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
            {this.renderTodayReport()}
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
        statusCounts: state.reports.statusCounts,
        orderTrends: state.reports.orderTrends
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(reportActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { "withRef": true })(ReportScreen);
