import React, { useState, useEffect } from "react";
import { View, StatusBar, StyleSheet, Platform } from "react-native";
import { Text, Icon, Button, CheckBox } from "components";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { uniq, intersection, max, min } from "lodash";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

function Filter({ onBackPress, data, filterVal, onChangeFilter, filter }) {
  console.log(filterVal);
  console.log(data)
  const { primary_color_dark, primary_color, primary_color_text } = useSelector(
    state => state.appSettings,
  );
  const { t } = useTranslation();

  const filterTabs = ["Price", "Categories", "Color", "Size"];

  const [index, setIndex] = useState(0);
  const [priceFilter, setpriceFilter] = useState([]);
  const [colorFilter, setcolorFilter] = useState([]);
  const [sizeFilter, setsizeFilter] = useState([]);
  const [cateFilter, setcateFilter] = useState([])

  useEffect(() => {
    let price = [];
    for (let value of data) {
      price.push(parseInt(value.price));
    }
    price = [Math.floor(min(price)), Math.ceil(max(price))];
    setpriceFilter(price);
  }, [])

  const onChangeIndex = index => () => {
    setIndex(index);
  };

  const onSliderUpdate = key => value => {
    //return;
    let newData = Object.assign({}, filterVal);
    newData[key] = [value[0], value[1] || priceFilter[key][1]];
    onChangeFilter && onChangeFilter(newData);
  };

  const updateFilter = (key, item, index) => () => {
    console.log(filterVal);
    if (!filterVal[key]) {
      var newData = { ...filterVal, [key]: [] };
    } else {
      var newData = { ...filterVal };
    }
    console.log(newData[key].includes(item));
    //return;
    if (newData[key].includes(item)) {
      let newdata = newData[key].filter(val => val !== item);
      console.log(newdata);
      //setcolorFilter(newdata);
      //console.log(colorFilter);
      var newDataVal = { ...filterVal, [key]: newdata };
      if (key == "pa_size") {
        setsizeFilter(newDataVal[key])
      } else {
        setcolorFilter(newDataVal[key])
      }
    } else {
      // console.log("key"+newData[key])
      let newVal = newData[key];
      newVal.push(item);
      console.log(newVal);
      //setcolorFilter(newdata)
      var newDataVal = { ...filterVal, [key]: newVal };
      if (key == "pa_size") {
        setsizeFilter(newDataVal[key])
      } else {
        setcolorFilter(newDataVal[key])
      }
    }
    //return;

    onChangeFilter && onChangeFilter(newDataVal);
  };

  return (
    <View style={{ flex: 1, margin: -21 }}>
      <StatusBar backgroundColor={primary_color_dark} barStyle="light-content" />
      <View style={[styles.container, { backgroundColor: primary_color }]}>
        <Button onPress={onBackPress} style={styles.menuButton}>
          <Icon color={primary_color_text} type="Entypo" name="cross" size={24} />
        </Button>

        <Text style={[styles.title, { color: primary_color_text }]}>{t("FILTER")}</Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 2, backgroundColor: "#E8EEF6" }}>
          {filterTabs.map((item, i) => (
            <Button
              style={[styles.filterTabs, { backgroundColor: i === index ? "#FFFFFF" : null }]}
              key={"filter_" + item + index}
              onPress={onChangeIndex(i)}>
              <Text>{item}</Text>
            </Button>
          ))}
        </View>
        <View style={{ flex: 3, backgroundColor: "#FFFFFF" }}>
          {index == 0 && (
            <View
              style={{
                marginHorizontal: Platform.OS == "ios" ? 10 : 0,
                alignItems: "center",
                padding: 8
              }}>
              <MultiSlider
                containerStyle={{ marginHorizontal: Platform.OS == "ios" ? 10 : 0 }}
                trackStyle={{ height: 4 }}
                selectedStyle={{ backgroundColor: "#F68E1F" }}
                markerStyle={{
                  marginTop: 4,
                  backgroundColor: "#F68E1F",
                  height: 20,
                  width: 20
                }}
                sliderLength={148}
                min={priceFilter[0]}
                max={priceFilter[1]}
                values={
                  [filterVal.price[0] || priceFilter[0], filterVal.price[1]] ||
                  priceFilter[1]
                }
                enabledTwo
                onValuesChangeFinish={onSliderUpdate("price")}
              />
              <View
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  flexDirection: "row"
                }}>
                <Text style={{ fontWeight: "700" }}>
                  {filterVal.price[0] || priceFilter[0]}
                </Text>
                <Text style={{ fontWeight: "700" }}>
                  {filterVal.price[1] || priceFilter[1]}
                </Text>
              </View>
            </View>
          )}
          {index == 1 && (
            <View
              style={{
                marginHorizontal: Platform.OS == "ios" ? 10 : 0,
                alignItems: "center",
                padding: 8,
              }}>
              <Text>categories</Text>
            </View>
          )}
          {index == 2 && (
            <View
              style={{
                marginHorizontal: Platform.OS == "ios" ? 10 : 0,
                alignItems: "center",
                padding: 8,
              }}>
              {filterVal.Color.options.map((item, index) => (
                <CheckBox
                  label={item.name}
                  key={"color" + item + index}
                  checked={filterVal["pa_color"] ? filterVal["pa_color"].includes(item.name) : colorFilter.includes(item.name)}
                  onPress={updateFilter(filterVal.Color.slug, item.name, index)}
                />
              ))}
            </View>
          )}
          {index == 3 && (
            <View
              style={{
                marginHorizontal: Platform.OS == "ios" ? 10 : 0,
                alignItems: "center",
                padding: 8,
              }}>
              {filterVal.Size.options.map((item, index) => (
                <CheckBox
                  label={item.name}
                  key={"size" + item + index}
                  checked={filterVal["pa_size"] ? filterVal["pa_size"].includes(item.name) : sizeFilter.includes(item.name)}
                  onPress={updateFilter(filterVal.Size.slug, item.name, index)}
                />
              ))}
            </View>
          )}
        </View>
      </View>
      <View style={styles.footer}>
        <Button style={styles.applyButton} onPress={filter} >
          <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Apply</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    height: 56,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    paddingHorizontal: 16,
  },
  menuButton: { padding: 16 },
  filterTabs: {
    width: "100%",
    padding: 16,
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    padding: 8,
    backgroundColor: "#FFFFFF"
  },
  applyButton: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    backgroundColor: "#F68E1F",
    borderRadius: 24,
    alignItems: "center"
  }
});

export default Filter;
