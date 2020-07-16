import React from "react";
import {TouchableOpacity, ImageBackground, View} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {useNavigation} from "react-navigation-hooks";
import {Text} from "components";

function CategoryItem({item, index}) {
  const navigation = useNavigation();

  const goToProductScreen = () => {
    navigation.navigate("ProductScreen", {category_id: item.id});
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          {
            width: 80,
            height: 80,
            borderRadius: 40,
            marginTop: 5,
            marginBottom: 5,
            backgroundColor: "#F0F0F2",
            elevation: 1,
            alignItems: "center",
            justifyContent: "center",
          },
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
          style={{width: 50, height: 50, borderRadius: 25}}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <Text
        style={{
          textAlign: "center",
          fontSize: 10,
          paddingVertical: 2,
          fontWeight: "700",
        }}>
        {item.name}
      </Text>
    </View>
  );
}

export default CategoryItem;
