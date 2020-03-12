import React, {useState, useEffect, useCallback} from "react";
import {View, StyleSheet, ScrollView, Switch} from "react-native";
import {Text, Toolbar, FloatingTextinput, Button} from "components";
import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {CustomPicker} from "react-native-custom-picker";
import {useNavigation} from "react-navigation-hooks";

function BillingAddresss() {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const user = useSelector(state => state.user);
  const appSettings = useSelector(state => state.appSettings);

  useEffect(() => {
    let arr = [];
    for (let i in appSettings.countries) arr.push({id: i, name: appSettings.countries[i]});
    console.log(arr);
    setCountry(arr);
  }, []);

  const [switchh, setSwitch] = useState(false);

  const [firstname, setFirstname] = useState(user.billing.first_name);
  const [lastname, setLastname] = useState(user.billing.last_name);
  const [email, setEmail] = useState(user.billing.email);
  const [phone, setPhone] = useState(user.billing.phone);
  const [city, setCity] = useState(user.billing.city);
  const [postcode, setPostcode] = useState(user.billing.postcode);
  const [address1, setAddress1] = useState(user.billing.address_1);
  const [address2, setAddress2] = useState(user.billing.address_2);
  const [counrtyy, setCountryy] = useState(user.billing.country);
  const [state, setState] = useState(user.billing.state);

  const [country, setCountry] = useState([]);

  const [stateData, setStateData] = useState([]);

  const onChangeFirstname = useCallback(text => {
    setFirstname(text);
  });
  const onChangeLastname = useCallback(text => {
    setLastname(text);
  });
  const onChangeEmail = useCallback(text => {
    setEmail(text);
  });
  const onChangePhone = useCallback(text => {
    setPhone(text);
  });
  const onChangeCity = useCallback(text => {
    setCity(text);
  });
  const onChangePostcode = useCallback(text => {
    setPostcode(text);
  });
  const onChangeAddress1 = useCallback(text => {
    setAddress1(text);
  });
  const onChangeAddress2 = useCallback(text => {
    setAddress2(text);
  });

  const changeSwitch = () => {
    setSwitch(!switchh);
  };

  const renderOption = settings => {
    const {item, getLabel} = settings;
    return (
      <View style={styles.optionContainer}>
        <View style={styles.innerContainer}>
          <View style={[styles.box, {backgroundColor: item.color}]} />
          <Text style={{color: item.color, alignSelf: "flex-start"}}>{getLabel(item)}</Text>
        </View>
      </View>
    );
  };

  const renderField = settings => {
    const {selectedItem, defaultText, getLabel, clear} = settings;
    return (
      <View style={styles.container}>
        <View>
          {!selectedItem && <Text style={[styles.text, {color: "#000000"}]}>{defaultText}</Text>}
          {selectedItem && (
            <View style={{}}>
              <Text style={[styles.text, {color: selectedItem.color}]}>
                {getLabel(selectedItem)}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const setCount = text => {
    setCountryy(text.name);

    let arr = [];
    let obj = appSettings.county_states[text.id];
    for (let i in obj) arr.push({id: i, name: obj[i]});
    setStateData(arr);
  };

  const setStateD = text => {
    setState(text.name);
  };

  const gotoShipping = () => {
    let billing = {
      first_name: firstname,
      last_name: lastname,
      company: user.billing.company,
      email: email,
      phone: phone,
      city: city,
      state: state,
      postcode: postcode,
      address_1: address1,
      address_2: address2,
      country: counrtyy,
    };
    if (switchh) {
      let shipping = {
        first_name: firstname,
        last_name: lastname,
        company: user.billing.company,
        city: city,
        state: state,
        postcode: postcode,
        address_1: address1,
        address_2: address2,
        country: counrtyy,
      };
      navigation.navigate("Review", {billing: billing, shipping: shipping});
    } else {
      navigation.navigate("ShippingAddresss", {billing: billing});
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{paddingHorizontal: 16}}>
        <FloatingTextinput
          label={t("FIRST_NAME")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={firstname}
          onChangeText={onChangeFirstname}
        />
        <FloatingTextinput
          label={t("LAST_NAME")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={lastname}
          onChangeText={onChangeLastname}
        />
        <FloatingTextinput
          label={t("EMAIL")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={email}
          onChangeText={onChangeEmail}
        />
        <FloatingTextinput
          label={t("PHONE_NUMBER")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={phone}
          onChangeText={onChangePhone}
        />
        <>
          <Text style={{fontSize: 12, color: appSettings.accent_color, marginTop: 10}}>
            Counrty
          </Text>
          <CustomPicker
            options={country}
            placeholder={counrtyy}
            getLabel={item => item.name}
            optionTemplate={renderOption}
            fieldTemplate={renderField}
            onValueChange={value => setCount(value)}
          />
        </>
        <>
          <Text style={{fontSize: 12, color: appSettings.accent_color, marginTop: 10}}>State</Text>
          <CustomPicker
            options={stateData}
            placeholder={state}
            getLabel={item => item.name}
            optionTemplate={renderOption}
            fieldTemplate={renderField}
            onValueChange={value => setStateD(value)}
          />
        </>
        <FloatingTextinput
          label={t("CITY")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={city}
          onChangeText={onChangeCity}
        />
        <FloatingTextinput
          label={t("POSTCODE")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={postcode}
          onChangeText={onChangePostcode}
        />
        <FloatingTextinput
          label={t("ADDRESS_1")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={address1}
          onChangeText={onChangeAddress1}
        />
        <FloatingTextinput
          label={t("ADDRESS_2")}
          labelColor="#000000"
          style={{color: "#000000"}}
          value={address2}
          onChangeText={onChangeAddress2}
        />
      </ScrollView>
      <View style={{margin: 5, flexDirection: "row", justifyContent: "space-between"}}>
        <Text>Same For Shipping</Text>
        <Switch onValueChange={changeSwitch} value={switchh} />
      </View>
      <View style={styles.footer}>
        <Button
          style={[styles.footerButton, {backgroundColor: appSettings.accent_color}]}
          onPress={gotoShipping}>
          <Text style={{color: "white", marginEnd: 5}}>NEXT</Text>
        </Button>
      </View>
    </View>
  );
}

BillingAddresss.navigationOptions = {
  header: <Toolbar backButton title="Billing Address" />,
};

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    elevation: 2,
    backgroundcolor: "#fff",
  },
  footerButton: {
    flex: 1,
    height: 40,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    borderBottomColor: "#EDEBF2",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: -20,
    marginStart: -40,
  },
  text: {
    fontSize: 14,
  },
  optionContainer: {
    marginHorizontal: 16,
    padding: 10,
    borderBottomColor: "#EDEBF2",
    borderBottomWidth: 1,
  },
  box: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  footer: {
    width: "100%",
    flexDirection: "row",
  },
  footerButton: {
    flex: 1,
    height: 40,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BillingAddresss;
