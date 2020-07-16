import React, {useEffect, useState} from "react";
import {View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator} from "react-native";
import {Text, Toolbar} from "components";
import {WooCommerce} from "service";
import {useSelector} from "react-redux";
import moment from "moment";
import {useTranslation} from "react-i18next";

function Orders({navigation}) {
  const {t} = useTranslation();
  const user = useSelector(state => state.user);
  const {accent_color} = useSelector(state => state.appSettings);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [page, setpage] = useState(1);

  useEffect(() => {
    const subscription = navigation.addListener("didFocus", () => {
      loadOrder();
    });
    subscription.remove();
    loadOrder();
  }, []);

  const onEndReached = () => {
    if (!refreshing) return;
    setpage(page + 1);
    setLoading(true);
    setRefreshing(false);
    loadOrder();
  };

  const loadOrder = () => {
    console.log("order");
    let params = {
      page: page,
      per_page: 10,
    };

    console.log(params);
    setLoading(true);
    WooCommerce.get("orders?customer=" + user.id, {params: params})
      .then(res => {
        console.log(orders.concat(res.data));
        setLoading(false);
        if (res.status == 200) {
          setOrders(orders.concat(res.data));
          setRefreshing(res.data.length == params.per_page);
          setLoading(false);
          if (page == 1) {
            setpage(page + 1);
          }
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const gotoOrderDetailsPage = item => () => {
    navigation.navigate("OrderDetails", {item: item});
  };

  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={[styles.card, {marginTop: index == 0 ? 8 : 4}, {marginBottom: 4}]}
        onPress={gotoOrderDetailsPage(item)}>
        <View style={styles.view}>
          <Text style={styles.font}>{t("ORDER_ID") + item.id}</Text>
          <Text
            style={{
              color:
                item.status == "processing"
                  ? "#76A42E"
                  : item.status == "cancelled" || item.status == "failed"
                  ? "#ff0000"
                  : item.status == "completed"
                  ? "#39A3CA"
                  : item.status == "refunded"
                  ? "#76A42E"
                  : item.status == "on-hold"
                  ? "#D0C035"
                  : "#FDB82B",
              fontWeight: "600",
              fontSize: 14,
            }}>
            {item.status.toUpperCase()}
          </Text>
        </View>
        <View style={[styles.view, {marginTop: 5}]}>
          <Text style={styles.smalltxt}>{t("NO_OF_ITEMS")}</Text>
          <Text style={styles.smalltxt}>{t("TOTAL")}</Text>
        </View>
        <View style={styles.view}>
          <Text style={[styles.text, styles.font, {color: "#757575"}]}>
            {item.line_items.length} items(s)
          </Text>
          <Text style={[styles.text, styles.font, {color: "#757575"}]}>{item.total}</Text>
        </View>
        <View style={[styles.view, {marginTop: 10}]}>
          <Text style={styles.smalltxt}>{t("ORDER_DATE")}</Text>
          <Text style={styles.smalltxt}>{t("BUYER")}</Text>
        </View>
        <View style={styles.view}>
          <Text style={[styles.text, styles.font, {color: "#757575"}]}>
            {moment(item.date_created).format("MMM DD,YYYY") +
              " " +
              moment(item.date_created).format("hh:mm A")}
          </Text>
          <Text style={[styles.text, styles.font, {color: "#757575"}]}>
            {item.billing.first_name + " " + item.billing.last_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const _keyExtractor = item => item.id;

  return (
    <View>
      <Toolbar backButton title={t("ORDERS")} />
      <FlatList
        data={orders}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.33}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
        ListFooterComponent={
          orders.length > 0 && loading ? (
            <ActivityIndicator
              color={accent_color}
              size="large"
              style={{alignItems: "center", justifyContent: "center"}}
            />
          ) : null
        }
      />
      {loading && <ActivityIndicator style={{alignItems: "center", justifyContent: "center"}} />}
    </View>
  );
}

Orders.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    elevation: 2,
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    backgroundColor: "#fff",
  },
  view: {flexDirection: "row", justifyContent: "space-between"},
  text: {
    flex: 1,
    lineHeight: 18,
  },
  font: {fontWeight: "600", fontSize: 14},
  smalltxt: {
    flex: 1,
    lineHeight: 18,
    fontSize: 14,
    color: "#adadad",
    fontWeight: "400",
  },
});

export default Orders;
