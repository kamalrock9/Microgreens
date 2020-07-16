import React, {useState, useEffect} from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  unstable_batchedUpdates,
  Dimensions,
} from "react-native";
import {Slider, Toolbar, Container, Text, Icon, Button} from "components";
import {useSelector, useDispatch} from "react-redux";
import {isEmpty} from "lodash";
import CategoryItem from "./CategoryItem";
import SectonHeader from "./SectonHeader";
import ProductsRow from "../product/ProductsRow";
import {saveHomeLayout, saveNotification} from "store/actions";
import {ApiClient} from "service";
import {useTranslation} from "react-i18next";
import OneSignal from "react-native-onesignal";

const {height} = Dimensions.get("window");
function HomeScreen({navigation}) {
  const [loading, setLoading] = useState(false);
  const layout = useSelector(state => state.homeLayout);
  const {primary_color} = useSelector(state => state.appSettings);
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const _categoryKeyExtractor = item => "category_" + item.id;

  // const trackScreenView = async screen => {
  //   // Set & override the MainActivity screen name
  //   await analytics().setCurrentScreen(screen, screen);
  // };

  useEffect(() => {
    //trackScreenView("Home Page");
    setLoading(layout ? false : true);
    ApiClient.get("/layout")
      .then(({data}) => {
        unstable_batchedUpdates(() => {
          dispatch(saveHomeLayout(data));
          setLoading(false);
        });
      })
      .catch(e => {
        setLoading(false);
      });
    OneSignal.init("71c73d59-6d8f-4824-a473-e76fe6663814", {
      kOSSettingsKeyAutoPrompt: true,
    });
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener("received", onReceived);
    OneSignal.addEventListener("opened", onOpened);
    return () => {
      OneSignal.removeEventListener("received", onReceived);
      OneSignal.removeEventListener("opened", onOpened);
    };
  }, []);

  const onReceived = notification => {
    console.log("Notification received: ", notification);
    dispatch(saveNotification(notification.payload));
  };

  const onOpened = openResult => {
    console.log("Message: ", openResult.notification.payload);
    console.log("openResult: ", openResult.notification);
    // navigationDeferred.promise.then(() => {
    //   NavigationService.navigate("NotificationScreen");
    // });
  };

  const goToPage = (route, params = {}) => () => {
    navigation.push(route, params);
  };

  const openCategories = () => {
    navigation.navigate("CategoryScreen");
  };

  const _renderItem = ({item, index}) => <CategoryItem item={item} index={index} />;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  } else if (isEmpty(layout)) {
    return <View />;
  } else {
    return (
      <Container style={{backgroundColor: "#F5F3F4"}}>
        <Toolbar menuButton cartButton wishListButton title="HOME" />
        <ScrollView nestedScrollEnabled={true}>
          <View style={[styles.sliderView, {backgroundColor: primary_color}]}>
            <Slider
              //autoplay
              //autoplayLoop
              //autoplayDelay={5}
              data={layout.banner}
              approxHeight={100}
              margin_Top={-50}
              borderradius={20}
              originalheight={height / 4}
            />
          </View>

          <View
            style={{
              marginHorizontal: 16,
              borderRadius: 25,
              elevation: 2,
              backgroundColor: "white",
              marginTop: -20,
            }}>
            <Button style={styles.button} onPress={goToPage("Search")}>
              <Text style={{color: "grey"}}>Search Your Product...</Text>
              <Icon name="search1" type="AntDesign" size={28} color={"grey"} />
            </Button>
          </View>

          <SectonHeader
            colorTitleEnd={primary_color}
            title={t("ALL_CATEGORIES")}
            titleEnd={t("VIEW_ALL")}
            onPress={openCategories}
            onPressArgs={["CategoryScreen"]}
          />

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={layout.categories}
            keyExtractor={_categoryKeyExtractor}
            renderItem={_renderItem}
            removeClippedSubviews={true}
          />

          {layout.featured_products && layout.featured_products.length > 0 && (
            <>
              <SectonHeader
                colorTitleEnd={primary_color}
                title={t("FEATURED")}
                titleEnd={t("VIEW_ALL")}
                style={{marginTop: 8}}
                onPress={goToPage("ProductScreen", {featured: true})}
              />
              <ProductsRow keyPrefix="featured" products={layout.featured_products} />
            </>
          )}

          {layout.top_rated_products && layout.top_rated_products.length > 0 && (
            <>
              <SectonHeader
                colorTitleEnd={primary_color}
                title={t("TOP_SELLERS")}
                titleEnd={t("VIEW_ALL")}
                style={{marginTop: 8}}
                onPress={goToPage("ProductScreen", {sortby: "rating"})}
              />
              <ProductsRow keyPrefix="toprated" products={layout.top_rated_products} />
            </>
          )}

          {layout.sale_products && layout.sale_products.length > 0 && (
            <>
              <SectonHeader
                colorTitleEnd={primary_color}
                title={t("TRENDING_OFFERS")}
                titleEnd={t("VIEW_ALL")}
                style={{marginTop: 8}}
                onPress={goToPage("ProductScreen", {on_sale: "true"})}
              />
              <ProductsRow keyPrefix="sale" products={layout.sale_products} />
            </>
          )}

          {layout.top_seller && layout.top_seller.length > 0 && (
            <View style={{marginBottom: 10}}>
              <SectonHeader
                colorTitleEnd={primary_color}
                title={t("TOP_SELLERS")}
                titleEnd={t("VIEW_ALL")}
                style={{marginTop: 8}}
                onPress={goToPage("ProductScreen", {sortby: "popularity"})}
              />
              <ProductsRow keyPrefix="topseller" products={layout.top_seller} />
            </View>
          )}
        </ScrollView>
      </Container>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sliderView: {
    paddingTop: 30,
    paddingBottom: 80,
    borderBottomStartRadius: 30,
    borderBottomRightRadius: 30,
  },
});

export default HomeScreen;
