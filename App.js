import React, {useEffect} from "react";
//React-Navigation
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import {createDrawerNavigator} from "react-navigation-drawer";

//SIDEMENU
import Drawer from "./src/pages/drawer/Drawer";
import TawkToChat from "./src/pages/drawer/TawkToChat";

//pages
import HomeScreen from "./src/pages/home/HomeScreen";
import CategoryScreen from "./src/pages/CategoryScreen";
import SplashScreen from "./src/pages/SplashScreen";
import ProductScreen from "./src/pages/product/ProductScreen";
import ProductDetailScreen from "./src/pages/product/ProductDetailScreen";
import Cart from "./src/pages/Cart/Cart";
import WishlistScreen from "./src/pages/WishlistScreen";
import TermAndCondition from "./src/pages/TermAndCondition";
import Orders from "./src/pages/Orders";
import OrderDetails from "./src/pages/OrderDetails";
import AccountSetting from "./src/pages/AccountSetting";
import ManageAddress from "./src/pages/manageAddress/ManageAddress";
import BillingAddress from "./src/pages/manageAddress/BillingAddress";
import ShippingAddress from "./src/pages/manageAddress/ShippingAddress";
import Download from "./src/pages/Download";
import Notification from "./src/pages/Notification";
import Wallet from "./src/pages/Wallet";
import ReferAndEarn from "./src/pages/ReferAndEarn";
import CheckoutScreen from "./src/pages/checkout/CheckoutScreen";
import BillingAddresss from "./src/pages/BillingAddress";
import ShippingAddresss from "./src/pages/ShippingAddress";
import Review from "./src/pages/Review";

//Redux
import {persistor, store} from "./src/store";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/lib/integration/react";

//I18nManager.forceRTL(false);

//Notification
import OneSignal from "react-native-onesignal";
import moment from "moment";

function App() {
  useEffect(() => {
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
  });

  const onReceived = notification => {
    console.log("Notification received: ", notification);
    console.log(moment(notification.payload.additionalData.date).local());
  };

  const onOpened = openResult => {
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
    // navigationDeferred.promise.then(() => {
    //   NavigationService.navigate("NotificationScreen");
    // });
  };

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppContainer />
      </PersistGate>
    </Provider>
  );
}

const HomeStack = createStackNavigator({
  HomeScreen,
  ProductDetailScreen,
  Cart,
  CheckoutScreen,
  BillingAddresss,
  ShippingAddresss,
  Review,
  WishlistScreen,
});

const CategoryStack = createStackNavigator({
  CategoryScreen,
  Cart,
  CheckoutScreen,
  WishlistScreen,
});

const ProductStack = createStackNavigator({
  ProductScreen,
  ProductDetailScreen,
  CheckoutScreen,
  Cart,
  WishlistScreen,
});

const DrawerNavigator = createDrawerNavigator(
  {
    HomeStack,
    ProductStack,
    CategoryStack,
    TawkToChat,
    TermAndCondition,
    Orders,
    OrderDetails,
    AccountSetting,
    ManageAddress,
    BillingAddress,
    ShippingAddress,
    Download,
    Notification,
    Wallet,
    ReferAndEarn,
    BillingAddresss,
    ShippingAddresss,
    Review,
  },
  {
    contentComponent: Drawer,
  },
);

const AppNavigator = createSwitchNavigator(
  {
    SplashScreen: SplashScreen,
    Drawer: DrawerNavigator,
  },
  {
    initialRouteName: "SplashScreen",
    backBehavior: "none",
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default App;
