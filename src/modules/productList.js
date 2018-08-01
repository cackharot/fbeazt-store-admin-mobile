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
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  async componentWillMount() {
      const store = await storage.load({key: 'userStore', autoSync: false, syncInBackgroud: false});
      this.setState({store: store}, ()=> {
          this._retrieveProducts();
      });
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.storeOrders) this.setState({ isLoading: false });
  }

  _viewProduct(product) {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'app.productDetails',
        passProps: {
          product
        },
        options: {
          topBar: {
            title: {
              text: `${product.name} Details`
            }
          }
        }
      }
    });
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
    const { store, filter_text } = this.state;
    const storeId = store._id.$oid;
    this.props.actions.retrieveProducts(storeId, filter_text)
        .then(() => {
            const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
            const dataSource = ds.cloneWithRows(this.props.products.items || []);
            this.setState({
            list: this.props.products.items || [],
            dataSource,
            isLoading: false
            });
            // this._viewProduct(this.props.products.items[1]);
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
                  <TouchableOpacity key={item._id.$oid} activeOpacity={0.8} onPress={this._viewProduct.bind(this, item)}>
                    <View style={styles.itemContainer}>
                      <View style={styles.itemLeftContainer}>
                        <Text style={styles.itemPrice}>₹{item.sell_price}</Text>
                        <View>
                          <Text style={styles.itemAvailability}>From</Text>
                          <Text style={styles.itemAvailability}>
                            {item.open_time.toString().trim()} to {item.close_time.toString().trim()}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.itemRightContainer}>
                        <View>
                          <Text style={styles.itemName}>{item.name}</Text>
                          {item.price_table.length > 0 &&
                            <Text note style={styles.itemVarieties}>{item.price_table.length} varieties</Text>
                          }
                        </View>
                        <View>
                          <Text note style={styles.itemCuisines}>{item.cuisines.join(",")}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
                renderFooter={() => <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}><Text note>Pull down to refresh</Text></View>}
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
