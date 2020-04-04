import React, {useRef, useState, useCallback, useReducer} from "react";
import {View, StyleSheet, ImageBackground, Dimensions, ActivityIndicator} from "react-native";
import {Icon, Text, Button, FloatingTextinput} from "components";
import SwiperFlatList from "react-native-swiper-flatlist";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import Constants from "service/Config";
import {ApiClient} from "service";
import {user} from "store/actions";
import Toast from "react-native-simple-toast";
import {GoogleSignin} from "@react-native-community/google-signin";
import {LoginManager, AccessToken, GraphRequest, GraphRequestManager} from "react-native-fbsdk";

const {width} = Dimensions.get("window");

const initialState = {
  loginEmail: "",
  loginPassword: "",
  firstname: "",
  lastname: "",
  signUpEmail: "",
  password: "",
  confirmPassword: "",
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "changeEmail":
      return {...state, loginEmail: action.payload};
    case "changePassword":
      return {...state, loginPassword: action.payload};
    case "changeFirstname":
      return {...state, firstname: action.payload};
    case "changeLastname":
      return {...state, lastname: action.payload};
    case "changeSignupEmail":
      return {...state, signUpEmail: action.payload};
    case "changePasswordSignup":
      return {...state, password: action.payload};
    case "changeConfirmPassword":
      return {...state, confirmPassword: action.payload};
    default:
      return state;
  }
}

function Auth({navigation}) {
  const [loading, setLoading] = useState(false);
  console.log(navigation);
  //return;
  const {NeedLogin, NeedRegister} = navigation.state.params;
  console.log(NeedRegister);

  const {t} = useTranslation();
  const dispatchAction = useDispatch();

  const [state, dispatch] = useReducer(reducer, initialState);

  const scrollRef = useRef(null);

  if (NeedRegister) {
    console.log("Reg");
    goToLastIndex;
  }

  const goToFirstIndex = () => {
    scrollRef.current.goToFirstIndex();
  };

  const goToLastIndex = () => {
    scrollRef.current.goToLastIndex();
  };

  const goback = () => {
    if (NeedLogin) {
      navigation.goBack();
    }
  };

  ///Login//
  const onChangeEmail = text => {
    dispatch({type: "changeEmail", payload: text});
  };
  const onChangePassword = text => {
    dispatch({type: "changePassword", payload: text});
  };

  //signup//
  const onChangeFirstname = text => {
    dispatch({type: "changeFirstname", payload: text});
  };

  const onChangeLastname = text => {
    dispatch({type: "changeLastname", payload: text});
  };

  const onChangeSignupEmail = text => {
    dispatch({type: "changeSignupEmail", payload: text});
  };

  const onChangepassword = text => {
    dispatch({type: "changePasswordSignup", payload: text});
  };

  const onChangeConfirmPassword = text => {
    dispatch({type: "changeConfirmPassword", payload: text});
  };

  const socialLogin = social => () => {
    if (social == "google") {
      GoogleSignin.configure();
      setLoading(true);
      GoogleSignin.signIn()
        .then(res => {
          let details = res.user;
          details.mode = "google";
          ApiClient.post("/social-login", details).then(({data}) => {
            console.log(data);
            setLoading(false);
            if (data.code == 1) {
              dispatchAction(user(data.details));
              //  onClose && onClose();
              if (NeedLogin) {
                navigation.goBack();
              }
              Toast.show("Login successfully", Toast.LONG);
            } else {
              Toast.show("Wrong Email / Password.", Toast.LONG);
            }
          });
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    } else {
      LoginManager.logInWithPermissions(["public_profile", "email"]).then(result => {
        if (result.isCancelled) {
          Toast.show("Login cancelled", Toast.LONG);
        } else {
          setLoading(true);
          AccessToken.getCurrentAccessToken()
            .then(data => {
              const infoRequest = new GraphRequest(
                "/me?fields=id,first_name,last_name,email,name",
                {accessToken: data.accessToken},
                (error, result) => {
                  if (error) {
                    setLoading(false);
                    Toast.show(error.toString(), Toast.LONG);
                    //  console.log(error);
                  } else {
                    console.log(result);
                    let details = result;
                    details.mode = "facebook";
                    setLoading(true);
                    ApiClient.post("/social-login", details).then(({data}) => {
                      console.log(data);
                      setLoading(false);
                      if (data.code == 1) {
                        dispatchAction(user(data.details));
                        //onClose && onClose();
                        if (NeedLogin) {
                          navigation.goBack();
                        }
                        Toast.show("Login successfully", Toast.LONG);
                      } else {
                        Toast.show("Wrong Email / Password.", Toast.LONG);
                      }
                    });
                  }
                },
              );
              new GraphRequestManager().addRequest(infoRequest).start();
            })
            .then(error => {
              setLoading(false);
            });
        }
      });
    }
  };

  const _login = () => {
    let param = {
      email: state.loginEmail,
      password: state.loginPassword,
    };
    setLoading(true);
    ApiClient.post("/login", param)
      .then(({data}) => {
        console.log(data);
        setLoading(false);
        if (data.code == 1) {
          dispatchAction(user(data.details));
          // onClose && onClose();
          if (NeedLogin) {
            navigation.goBack();
          }
        }
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const _register = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var bodyFormData = new FormData();
    bodyFormData.append("fname", state.firstname);
    bodyFormData.append("lname", state.lastname);
    bodyFormData.append("email", state.signUpEmail);
    bodyFormData.append("password", state.password);

    if (
      state.firstname != "" &&
      state.lastname != "" &&
      state.signUpEmail != "" &&
      state.password != "" &&
      state.confirmPassword != ""
    ) {
      if (reg.test(state.signUpEmail) === true) {
        if (state.password != state.confirmPassword) {
          Toast.show("Password does not match", Toast.LONG);
          return;
        }
        setLoading(true);
        ApiClient.post("/register", bodyFormData, {
          config: {headers: {"Content-Type": "multipart/form-data"}},
        })
          .then(({data}) => {
            console.log(data);
            setLoading(false);
            if (data.status == 1) {
              goToFirstIndex();
            } else {
              setLoading(false);
              Toast.show(data.error, Toast.LONG);
            }
          })
          .catch(error => {
            setLoading(false);
          });
      } else {
        Toast.show("Please enter the correct email address", Toast.LONG);
      }
    } else {
      Toast.show("Please fill all the details", Toast.LONG);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/imgs/login-background.jpg")}
      style={styles.container}>
      <Button style={{padding: 8, alignSelf: "flex-start"}} onPress={goback}>
        <Icon name="close" size={24} color="#FFF" type="MaterialCommunityIcons" />
      </Button>

      <SwiperFlatList ref={scrollRef}>
        <View style={styles.slide1}>
          <Text style={styles.title}>{t("WELCOME_TO_WOOAPP", {value: Constants.storeName})}</Text>
          <Text style={styles.subtitle}>{t("FASHION_INFO")}</Text>
          <View style={{width: "100%", flexDirection: "row", marginTop: 20}}>
            <Button
              style={[styles.socialBtn, {flex: 1, marginEnd: 8}]}
              onPress={socialLogin("facebook")}>
              <Icon name="logo-facebook" size={20} color="#FFF" />
              <Text style={[styles.socialBtnText, {marginStart: 8}]}>{t("FACEBOOK")}</Text>
            </Button>
            <Button
              style={[styles.socialBtn, {flex: 1, marginStart: 8}]}
              onPress={socialLogin("google")}>
              <Icon name="logo-google" size={20} color="#FFF" />
              <Text style={[styles.socialBtnText, {marginStart: 8}]}>{t("GOOGLE")}</Text>
            </Button>
          </View>
          <View style={{width: "100%", flexDirection: "row", marginVertical: 30}}>
            <View style={styles.line} />
            <Text style={styles.or}>{t("LOGIN_METHODS")}</Text>
            <View style={styles.line} />
          </View>

          <FloatingTextinput
            label={t("EMAIL")}
            labelColor="#FFFFFF"
            style={{color: "#FFFFFF"}}
            value={state.loginEmail}
            onChangeText={onChangeEmail}
          />
          <View style={{marginTop: 10}}>
            <FloatingTextinput
              secureTextEntry={true}
              label={t("PASSWORD")}
              labelColor="#FFFFFF"
              style={{color: "#FFFFFF"}}
              value={state.loginPassword}
              onChangeText={onChangePassword}
            />
          </View>
          <Button style={{alignSelf: "flex-end", marginTop: 16, paddingVertical: 8}}>
            <Text style={styles.socialBtnText}>{t("FORGOT")}</Text>
          </Button>

          <Button style={styles.btn} onPress={_login}>
            <Text style={styles.btnText}>{t("SIGN_IN")}</Text>
          </Button>
          <View style={{width: "100%", flexDirection: "row", marginTop: 20, alignItems: "center"}}>
            <Text style={styles.socialBtnText}>{t("DONT_HAVE_ACCOUNT")}</Text>
            <Button
              style={[styles.socialBtn, {paddingHorizontal: 8, marginStart: 8}]}
              onPress={goToLastIndex}>
              <Text style={styles.socialBtnText}>{t("SIGN_UP")}</Text>
            </Button>
          </View>
        </View>
        <View style={styles.slide1}>
          <Text style={styles.title}>{t("WELCOME_TO_WOOAPP", {value: Constants.storeName})}</Text>
          <Text style={styles.subtitle}>{t("FASHION_INFO")}</Text>
          <View style={{width: "100%", flexDirection: "row", marginTop: 20}}>
            <Button
              style={[styles.socialBtn, {flex: 1, marginEnd: 8}]}
              onPress={socialLogin("facebook")}>
              <Icon name="logo-facebook" size={20} color="#FFF" />
              <Text style={[styles.socialBtnText, {marginStart: 8}]}>{t("FACEBOOK")}</Text>
            </Button>
            <Button
              style={[styles.socialBtn, {flex: 1, marginStart: 8}]}
              onPress={socialLogin("google")}>
              <Icon name="logo-google" size={20} color="#FFF" />
              <Text style={[styles.socialBtnText, {marginStart: 8}]}>{t("GOOGLE")}</Text>
            </Button>
          </View>
          <View style={{width: "100%", flexDirection: "row", marginVertical: 30}}>
            <View style={styles.line} />
            <Text style={styles.or}>{t("OR")}</Text>
            <View style={styles.line} />
          </View>

          <FloatingTextinput
            label={t("FIRST_NAME")}
            labelColor="#FFFFFF"
            style={{color: "#FFFFFF"}}
            value={state.firstname}
            onChangeText={onChangeFirstname}
          />
          <View style={{marginTop: 10}}>
            <FloatingTextinput
              label={t("LAST_NAME")}
              labelColor="#FFFFFF"
              style={{color: "#FFFFFF"}}
              value={state.lastname}
              onChangeText={onChangeLastname}
            />
          </View>
          <View style={{marginTop: 10}}>
            <FloatingTextinput
              label={t("EMAIL")}
              labelColor="#FFFFFF"
              style={{color: "#FFFFFF"}}
              value={state.signUpEmail}
              onChangeText={onChangeSignupEmail}
            />
          </View>
          <View style={{marginTop: 10}}>
            <FloatingTextinput
              label={t("PASSWORD")}
              labelColor="#FFFFFF"
              style={{color: "#FFFFFF"}}
              value={state.password}
              onChangeText={onChangepassword}
            />
          </View>
          <View style={{marginTop: 10}}>
            <FloatingTextinput
              label={t("CONFIRM_PASSWORD")}
              labelColor="#FFFFFF"
              style={{color: "#FFFFFF"}}
              value={state.confirmPassword}
              onChangeText={onChangeConfirmPassword}
            />
          </View>

          <Button style={styles.btn} onPress={_register}>
            <Text style={styles.btnText}>{t("SIGN_UP")}</Text>
          </Button>
          <Text style={[styles.socialBtnText, {marginTop: 15}]}>
            By Singing up you will agree to our Privacy Policy and Terms
          </Text>
          <View style={{width: "100%", flexDirection: "row", marginTop: 25, alignItems: "center"}}>
            <Text style={styles.socialBtnText}>{t("HAVE_AN_ACCOUNT")}</Text>
            <Button
              style={[styles.socialBtn, {paddingHorizontal: 8, marginStart: 8}]}
              onPress={goToFirstIndex}>
              <Text style={styles.socialBtnText}>{t("SIGN_IN")}</Text>
            </Button>
          </View>
        </View>
      </SwiperFlatList>
      {loading && (
        <ActivityIndicator style={{alignItems: "center", justifyContent: "center", flex: 1}} />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  slide1: {
    flex: 1,
    width,
    padding: 16,
  },
  title: {
    color: "#FFF",
    fontWeight: "500",
    fontSize: 18,
  },
  subtitle: {
    color: "#FFF",
    marginTop: 4,
    fontSize: 13,
  },
  socialBtn: {
    flexDirection: "row",
    borderColor: "#FFFFFF",
    borderRadius: 2,
    borderWidth: 1,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  socialBtnText: {
    color: "#FFF",
    fontSize: 12,
  },
  line: {
    flex: 1,
    alignSelf: "center",
    height: 1,
    backgroundColor: "#FFF",
  },
  or: {
    color: "#FFF",
    paddingHorizontal: 8,
    fontSize: 12,
  },
  btn: {
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 2,
    justifyContent: "center",
  },
  btnText: {
    fontWeight: "600",
  },
});

export default Auth;
