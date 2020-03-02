import React, {useCallback, useState} from 'react';
import {View, StyleSheet, FlatList, Image, TextInput, Alert} from 'react-native';
import {Toolbar, Button, Text, Icon} from '../../components';
import {connect} from 'react-redux';
import {ApiClient} from '../../service';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import CartPriceBreakup from './CartPriceBreakup';
import CartItem from './CartItem';

class Cart extends React.PureComponent {
  static navigationOptions = {
    header: <Toolbar backButton title="Cart" />,
  };
  constructor(props) {
    super(props);
    this.state = {
      cart_data: [],
    };
  }

  componentDidMount() {
    ApiClient.get('/cart')
      .then(({data}) => {
        console.log(data);
        this.setState({cart_data: data});
      })
      .catch(() => {});
  }

  quantityIncrementDecremnt = () => {
    ApiClient.get('/cart')
      .then(({data}) => {
        console.log(data);
        this.setState({cart_data: data});
      })
      .catch(() => {});
  };

  renderItem = ({item, index}) => (
    <CartItem
      item={item}
      index={index}
      quantityIncrementDecremnt={this.quantityIncrementDecremnt}
    />
  );

  renderFooter = () => <CartPriceBreakup data={this.state.cart_data} />;

  render() {
    const {cart_data, couponCode} = this.state;
    const {appSettings} = this.props;
    return (
      <>
        <View style={styles.container}>
          <FlatList
            data={cart_data.cart_data}
            renderItem={this.renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={ItemSeparatorComponent}
            ListFooterComponent={this.renderFooter}
          />
          <View style={styles.footer}>
            <Button style={[styles.footerButton, {backgroundColor: appSettings.accent_color}]}>
              <Text style={{color: 'white'}}>CHECKOUT {' | '} #55.00</Text>
            </Button>
          </View>
        </View>
      </>
    );
  }
}

const keyExtractor = (item, index) => item + 'sap' + index;

function ItemSeparatorComponent() {
  return (
    <View
      style={[
        styles.line,
        {
          marginStart: 96,
          marginVertical: 8,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    borderWidth: 1,
    borderColor: '#D2d2d9',
    backgroundColor: '#D2d2d2',
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {fontWeight: '700'},
  footer: {
    width: '100%',
    flexDirection: 'row',
  },
  footerButton: {
    flex: 1,
    height: 40,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#F1F1F1',
  },
  btnTxt: {
    fontWeight: '600',
    fontSize: 24,
    marginBottom: 5,
  },
});

const mapStateToProps = state => ({
  appSettings: state.appSettings,
});

export default connect(mapStateToProps)(Cart);
