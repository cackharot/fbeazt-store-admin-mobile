import React, { Component } from 'react';
import PropTypes from 'prop-types';
const { Navigation } = require('react-native-navigation');
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ListView,
  Platform
} from 'react-native';
import { Root, ListItem } from "native-base";
import { Container, Segment, Button, Right, Left, Header, Title, Body, Toast, Content, Icon } from 'native-base';
import * as productListActions from '../actions/productListActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles/products';

import ProgressBar from './components/progressBar';

class ProductList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      isLoading: true,
      isRefreshing: false,
      showToast: false,
      filter_text: ""
    };

    this._viewProduct = this._viewProduct.bind(this);
    this._updateProductStatus = this._updateProductStatus.bind(this);
    this._showMessage = this._showMessage.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentWillMount() {
    this._retrieveProducts();
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.storeOrders) this.setState({ isLoading: false });
  }

  _showMessage(nextStatus, response) {
    if (response.status === "error") {
      console.log(`Update failed order status to ${nextStatus}`);
      Toast.show({
        text: `Cannot update status to ${nextStatus}`,
        duration: 3000,
        type: "danger"
      });
    } else {
      Toast.show({
        text: `Updated status to ${nextStatus}`,
        duration: 3000,
        type: "success"
      });
    }
  }

  _viewProduct(storeOrderId) {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'app.orderDetails',
        passProps: {
          storeOrderId
        },
        options: {
          topBar: {
            title: {
              text: `Order Details`
            }
          }
        }
      }
    });
  }

  _updateProductStatus(id, currentStatus, nextStatus) {
    if (currentStatus === nextStatus) {
      Toast.show({
        text: "Already updated!",
        buttonText: "Okay",
        type: "warning"
      });
    } else {
      console.log(`Updating product ${id} status to ${nextStatus}`);
      this.props.actions.updateProductStatus(id, nextStatus)
        .then(() => {
          this._showMessage(nextStatus, this.props.updateProductStatus);
          this._retrieveProducts(true);
        });
    }
  }

  _onRefresh() {
    this.setState({ isRefreshing: true });
    this._retrieveProducts(true);
  }

  _onFilterChange(filter_text) {
    this.setState({ isRefreshing: true, filter_text: filter_text }, () => {
      this._retrieveProducts(true);
    });
  }

  _retrieveProducts(isRefreshed) {
    const { filter_text } = this.state;
    this.props.actions.retrieveProducts(filter_text)
      .then(() => {
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        const dataSource = ds.cloneWithRows(this.props.products.items);
        this.setState({
          list: this.props.products.items,
          dataSource,
          isLoading: false
        });
        // this._viewOrder(this.props.storeOrders.items[2]._id.$oid);
      });
    if (isRefreshed && this.setState({ isRefreshing: false }));
  }

  render() {
    return (
      this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
        <Root>
          <Container>
            <Content contentContainerStyle={{ flexBasis: '100%' }}>
              <ListView
                style={styles.container}
                enableEmptySections
                // onEndReached={type => this._retrieveNextPage(this.props.type)}
                onEndReachedThreshold={1200}
                dataSource={this.state.dataSource}
                renderRow={item => (
                  <ListItem noIndent key={item._id.$oid}>
                    <Body>
                      <Text>{item.name}</Text>
                      <Text>{item.category}</Text>
                      {
                        item.price_table.map(x => {
                          <Text key={x.no}>hello</Text>
                        })
                      }
                    </Body>
                    <Right>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text note>₹{item.sell_price}</Text>
                      </View>
                    </Right>
                  </ListItem>
                )}
                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
                renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh}
                    colors={['#EA0000']}
                    tintColor="white"
                    title="loading..."
                    titleColor="white"
                    progressBackgroundColor="white"
                  />
                }
              />
            </Content>
          </Container>
        </Root>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    products: state.products.list,
    updateProductStatus: state.products.updateProductStatus
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(productListActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { "withRef": true })(ProductList);
