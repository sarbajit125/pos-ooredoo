import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import Title26Noto from "../components/Title26Noto";
import Header14RubikLbl from "../components/Header14RubikLbl";
import { Formik } from "formik";
import * as yup from "yup";
import OoredooPayBtn from "../components/OoredooPayBtn";
import OoredooTextInput from "../components/OoredooTextInput";
import ValidationErrLbl from "../components/ValidationErrLbl";
import { TextInput } from "react-native-paper";
import { APIManager } from "../AppManger/ApiManger";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useToast } from "react-native-toast-notifications";
const loginValidationSchema = yup.object().shape({
  username: yup.string().required("Username is Required"),
  password: yup.string().required("Password is required"),
});

const Login = (props: LoginScreenProps) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const toast = useToast();
  const handleForgetPassword = () => {
    console.log("Forget password");
  };

  const handleLogin = (username:string, password: string) => {
    APIManager.sharedInstance().loginAPI(username, password).then((value) => {
      setToastMessage(value.message)
      setLoginSuccess(true)
     const successToast =  toast.show("Login Successfull", {
        type:"success",
        placement:"bottom",
        duration: 1000,
        animationType: "slide-in",
      })
      props.navigation.navigate('Dashboard')
    }).catch((err) => {
      setToastMessage(err.message)
    })
  }
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          style={styles.logo}
          source={require("../assets/images/ooredoo-logo.png")}
        />
        <View style={styles.headingView}>
          <Title26Noto style={styles.greetingTitle}>Hello Again !</Title26Noto>
          <Header14RubikLbl style={styles.greetingDesc}>
            Please login to continue on ooredoo POS
          </Header14RubikLbl>
        </View>
      </View>
      <View >
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          onSubmit={(values) => handleLogin(values.username, values.password)}
          validationSchema={loginValidationSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isValid,
            touched,
          }) => (
            <View style={styles.formView}>
              <View>
              <OoredooTextInput
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
                style={styles.userTF}
                placeholder="UserName"
              />
              {errors.username && touched.username && (
                <ValidationErrLbl>{errors.username}</ValidationErrLbl>
              )}
              <OoredooTextInput
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                style={styles.passwordTF}
                placeholder="Password"
                secureTextEntry={passwordVisibility}
                right={
                  <TextInput.Icon
                    icon="eye"
                    onPress={() => setPasswordVisibility(!passwordVisibility)}
                  />
                }
              />
              {errors.password && touched.password && (
                <ValidationErrLbl>{errors.password}</ValidationErrLbl>
              )}
              </View>  
              <View style={styles.buttonView}>
                <OoredooPayBtn
                  title="Login"
                  onPress={handleSubmit}
                  style={styles.paybtn}
                />
                <TouchableOpacity
                  onPress={handleForgetPassword}
                  style={styles.forgetPass}
                >
                  <Header14RubikLbl>Forget Password ?</Header14RubikLbl>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
     
    </SafeAreaView>
  );
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Root">

export default Login;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginLeft: 29,
    marginRight: 16,
  },
  logo: {
    marginTop: 60,
    padding: 5,
    width: 174,
    height: 36,
  },
  headingView: {
    marginTop: 10,
    padding: 5,
    marginBottom: 10,
  },
  greetingTitle: {},
  greetingDesc: {},
  formView: {
    marginTop: 3,
    padding: 5,
  },
  buttonView: {
    marginTop: 30,
    alignSelf: "center",
    padding: 5,
    width: "80%",
  },
  paybtn: {},
  userTF: {
    marginTop: 10,
  },
  passwordTF: {
    marginTop: 10,
  },
  forgetPass: {
    marginTop: 20,
    alignSelf:'center',
  },
  toast:{
    width: "80%"
  }
});
