import React, {Component} from "react";
import {View, TouchableOpacity} from "react-native";
import Text from "./Text";

class QuantitySelector extends Component {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F58000",
            borderWidth: 1,
            borderRadius: 8,
            borderColor: "#efefef",
          }}
          onPress={this.props.minusClick}>
          <Text style={{fontSize: 25, color: "#fff", marginTop: -4}}>-</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            width: 30,
            textAlign: "center",
          }}>
          {this.props.quantity}
        </Text>
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F58000",
            borderWidth: 1,
            borderColor: "#efefef",
            borderRadius: 8,
          }}
          onPress={this.props.plusClick}>
          <Text style={{fontSize: 25, color: "#fff", marginTop: -4}}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default QuantitySelector;
