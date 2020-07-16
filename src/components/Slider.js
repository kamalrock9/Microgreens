import React from "react";
import {View, Dimensions} from "react-native";
import SwiperFlatList from "react-native-swiper-flatlist";
import FitImage from "react-native-fit-image";

const {width, height} = Dimensions.get("window");

const renderItem = ({item, index}) => (
  <View style={{width, paddingStart: 16, paddingEnd: 16}}>
    <FitImage
      style={{borderRadius: 20}}
      originalHeight={height / 4}
      originalWidth={width - 16}
      source={{uri: item.banner_url || item.src}}
    />
  </View>
);

const keyExtractor = item => item.id.toString();

function Slider({data, margin_Top, ...props}) {
  return (
    <SwiperFlatList
      {...props}
      data={data}
      nestedScrollEnabled={true}
      paginationActiveColor="black"
      showPagination={data.length > 1 ? true : false}
      paginationStyleItem={{
        width: 8,
        height: 8,
        marginHorizontal: 5,
        marginTop: margin_Top ? margin_Top : 0,
      }}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      style={{width}}
    />
  );
}

export default React.memo(Slider);
