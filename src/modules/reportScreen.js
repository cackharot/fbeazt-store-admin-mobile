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


class ReportScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            reports: {},
            query: {}
        };
    }

    async componentWillMount() {
        const store = await storage.load({key: 'userStore', autoSync: false, syncInBackgroud: false});
        this.setState({store: store}, ()=> {
            this._retrieveReports();
        });
    }

    async _retrieveReports() {
        const {store, query} = this.state;
        const storeId = store._id.$oid;
        this.props.actions.getReports(storeId, query)
            .then(() => {
                this.setState({isLoading: false});
                const res =  this.props.reports;
                console.log(`Got reports ${res}`);
                if(res && res.error){
                    console.log(`${res.error}`);
                }else if(res && res.items){
                    this.setState({
                        reports: this.props.reports
                    });
                }
            });
    }

    render() {
        const { reports } = this.props;
        return (
            this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
                <Root>
                    <Container>
                        <Content>
                <Text>Work in progress</Text>
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
        reports: state.reports.list
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(reportActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { "withRef": true })(ReportScreen);
