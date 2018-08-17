import React, { Component } from 'react';
import PropTypes from 'prop-types';
const { Navigation } = require('react-native-navigation');
import {
  ImageBackground,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ListView,
  Platform
} from 'react-native';
import { Root, List, ListItem } from "native-base";
import { Container, Separator, Segment, Button, Right, Left, Header, Title, Body, Toast, Content, Icon } from 'native-base';
import * as productListActions from '../actions/productListActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles/productDetails';

import ProgressBar from './components/progressBar';

class ProductDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      isLoading: true,
      isRefreshing: false,
      showToast: false,
      filter_text: ""
    };
  }

  componentWillMount() {
    // this._retrieveProducts();
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.storeOrders) this.setState({ isLoading: false });
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

  _getTimeIn12(timeStr) {
    const time = parseFloat(timeStr);
    if (time <= 12.0) {
      return time;
    }
    return time - 12.0;
  }

  render() {
    const { product } = this.props;
    return (
      <Root>
        <Container>
          <Content>
            <View>
              <ImageBackground source={require('../images/detail_bg.jpg')} style={styles.imageBackdrop} >
                <View style={styles.detailHeaderContainer}>
                    <View style={{flex: 0.7}}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                            <Icon name="pizza" active style={styles.statusIcon} />
                            <Text numberOfLines={2} style={styles.itemName}>{product.name}</Text>
                        </View>
                        <View style={{ paddingLeft: 38 }}>
                        {product.price_table.length > 0 &&
                            <Text note style={styles.itemVarieties}>{product.price_table.length} varieties</Text>
                        }
                        <Text note style={styles.itemCuisines}>{product.cuisines.join(",")}</Text>
                        </View>
                    </View>
            {product.price_table.length === 0 && (
                    <View style={{ flex: 0.3, flexDirection: 'column', alignItems: 'flex-end', alignSelf: 'flex-end' }}>
                        <Text style={styles.itemPrice}>₹{parseFloat(product.sell_price).toFixed(2)}</Text>
                    </View>
            )}
                </View>
              </ImageBackground>
              {/* <LinearGradient colors={['rgba(0, 0, 0, 0.2)', 'rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.7)']} style={styles.linearGradient} /> */}
            </View>
            <View>
              <Separator>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="clock" style={{ fontSize: 22, marginRight: 10 }} />
                  <Text>AVAILABILITY</Text>
                </View>
              </Separator>
              <ListItem noIndent>
                <Body>
                  <Text>
                    From {this._getTimeIn12(product.open_time)} AM to {this._getTimeIn12(product.close_time)} PM
                  </Text>
                </Body>
              </ListItem>
            </View>
            {product.price_table.length > 0 &&
              <Separator>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="basket" style={{ fontSize: 22, marginRight: 10 }} />
                  <Text>VARIETIES</Text>
                </View>
              </Separator>
            }
            {product.price_table.length > 0 &&
              <View>
                <List noIndent dataArray={product.price_table}
                  renderRow={(item) =>
                    <ListItem noIndent>
                      <Body>
                        <Text>{item.description}</Text>
                      </Body>
                      <Right>
                        <Text note>₹{parseFloat(item.price).toFixed(2)}</Text>
                      </Right>
                    </ListItem>
                  }>
                </List>
              </View>
            }
          </Content>
        </Container>
      </Root>
    );
  }
}

ProductDetails.propTypes = {
  product: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(productListActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { "withRef": true })(ProductDetails);
