import React from "react";
import {View, StyleSheet, FlatList} from "react-native";
import {Text, Toolbar, Icon, Button} from "components";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import WishListItem from "./WishListItem";
import {isArray, isEmpty} from "lodash";

function WishlistScreen({navigation}) {
  const {t} = useTranslation();
  const wishlist = useSelector(state => state.wishlist);
  const {accent_color} = useSelector(state => state.appSettings);
  console.log(wishlist);

  const gotoProduct = () => {
    navigation.navigate("ProductStack");
  };

  const _renderItem = ({item, index}) => <WishListItem item={item} index={index} />;

  const _keyExtractor = item => item.id;

  return (
    <View style={{flex: 1}}>
      <Toolbar backButton wishListButton title={t("WISHLIST") + " (" + wishlist.length + ")"} />
      {isArray(wishlist) && isEmpty(wishlist) && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}>
          <Icon name="md-heart-empty" size={44} color={accent_color} />
          <Text style={{textAlign: "center", fontSize: 20, color: accent_color}}>
            {t("NO_WISHLIST")}
          </Text>
          <Button
            style={{backgroundColor: accent_color, borderRadius: 3, marginTop: 5, elevation: 2}}
            onPress={gotoProduct}>
            <Text style={{color: "#fff", paddingHorizontal: 15, paddingVertical: 8}}>
              {t("START_SHOPPING")}
            </Text>
          </Button>
        </View>
      )}
      {!isEmpty(wishlist) && (
        <FlatList
          data={wishlist}
          renderItem={_renderItem}
          keyExtractor={_keyExtractor}
          numColumns={2}
        />
      )}
    </View>
  );
}

WishlistScreen.navigationOptions = {
  header: null,
};

export default WishlistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
