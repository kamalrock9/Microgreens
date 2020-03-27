import React from "react";
import {TouchableOpacity, ImageBackground} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {useNavigation} from "react-navigation-hooks";
import {Text} from "components";

function CategoryItem({item, index}) {
  const navigation = useNavigation();

  const goToProductScreen = () => {
    navigation.navigate("ProductScreen", {category_id: item.id});
  };

  return (
    <TouchableOpacity
      style={[
        {width: 80, height: 60, borderRadius: 3, marginTop: 5, marginBottom: 15},
        index == 0 ? {marginStart: 12, marginEnd: 10} : {marginEnd: 10},
      ]}
      onPress={goToProductScreen}>
      <ImageBackground
        source={{
          uri: item.image
            ? typeof item.image == "string"
              ? item.image
              : item.image.src
            : "https://source.unsplash.com/1600x900/?" + item.name,
        }}
        style={{width: 80, height: 60, flex: 1, borderRadius: 3}}
        resizeMode="cover">
        <LinearGradient
          colors={["#afafaf5e", "#000000ff"]}
          style={{position: "absolute", width: "100%", bottom: 0}}>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 10,
              paddingVertical: 2,
              fontWeight: "700",
            }}>
            {item.name.toUpperCase()}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

export default CategoryItem;
