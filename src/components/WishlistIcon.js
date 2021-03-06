import React from "react";
import {View, StyleSheet} from "react-native";
import {connect} from "react-redux";
import {addWishlist, deleteWishlist} from "store/actions";
import Button from "./Button";
import Icon from "./IconNB";

class WishlistIcon extends React.PureComponent {
  _handleWishlist = () => {
    if (this.isWishlist()) {
      this.props.deleteWishlist(this.props.item.id);
    } else {
      this.props.addWishlist(this.props.item);
    }
  };

  isWishlist = () => {
    return this.props.wishlist.some(el => el.id == this.props.item.id);
  };

  render() {
    const {appSettings, style} = this.props;
    return (
      <Button style={StyleSheet.flatten(style)} onPress={this._handleWishlist}>
        <Icon
          name={"heart"}
          type="MaterialCommunityIcons"
          style={{
            color: this.isWishlist() ? appSettings.accent_color : "#fff",
            // margin: 4,
            fontSize: 20,
          }}
        />
      </Button>
    );
  }
}

mapStateToProps = state => ({
  appSettings: state.appSettings,
  wishlist: state.wishlist,
});

mapDispatchToProps = {
  addWishlist,
  deleteWishlist,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WishlistIcon);
