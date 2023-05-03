import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import Title26Noto from "../components/OoredooFonts/Noto/Title26Noto";
import Header14RubikLbl from "../components/OoredooFonts/Rubik/Header14RubikLbl";
import { Formik } from "formik";
import * as yup from "yup";
import OoredooPayBtn from "../components/OoredooPayBtn";
import OoredooTextInput from "../components/OoredooTextInput";
import { TextInput } from "react-native-paper";
import { APIManager } from "../AppManger/ApiManger";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useToast } from "react-native-toast-notifications";
import { useMutation } from "react-query";
import { APIError } from "../responseModels/responseModels";
import OoredooActivityView from "../components/OoredooActivityView";
import OoredooBadReqView from "../components/errors/OoredooBadReqView";
const loginValidationSchema = yup.object().shape({
  username: yup.string().required("Username is Required"),
  password: yup.string().required("Password is required"),
});

const Login = (props: LoginScreenProps) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [showErrorView, setErrorView] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('')
  const toast = useToast();
  const handleForgetPassword = () => {
    console.log("Forget password");
  };
  const loginmutation = useMutation({
    mutationFn: ({ username, password }: LoginReq) =>
      APIManager.sharedInstance().loginAPI(username, password),
    onSuccess(data, _variables, _context) {
      setErrorView(false)
      toast.show(data.message, {
        type: "success",
        placement: "bottom",
        duration: 1000,
        animationType: "slide-in",
      });
       props.navigation.navigate('Home', {screen:'Dashboard'})
    },
    onError(error, _variables, _context) {
      if (error instanceof APIError) {
        setErrorView(true)
        setErrorMsg(error.message)
      } else {
        toast.show("something went wrong", {
          type: "error",
          placement: "bottom",
          duration: 1000,
          animationType: "slide-in",
        });
      }
    },
  });
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
      <View>
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          onSubmit={(values) =>
            loginmutation.mutate({
              username: values.username,
              password: values.password,
            })
          }
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
            dirty
          }) => (
            <View style={styles.formView}>
              <View>
                <OoredooTextInput
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                  style={styles.userTF}
                  placeholder="UserName"
                  showError={errors.username && touched.username}
                  errorMsg={errors.username}
                />
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
                  showError={errors.password && touched.password}
                  errorMsg={errors.password}
                />
              </View>
              <View style={styles.buttonView}>
                <OoredooPayBtn
                  title="Login"
                  onPress={handleSubmit}
                  style={styles.paybtn}
                  isDisabled={!(isValid && dirty)}
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
        {loginmutation.isLoading ? <OoredooActivityView visible={loginmutation.isLoading} /> : null}
        {loginmutation.isError ? <OoredooBadReqView modalVisible={showErrorView} action={function (): void {
          setErrorView(false)
        } } title={errorMsg} /> : null}
      </View>
    </SafeAreaView>
  );
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Root">;

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
    alignSelf: "center",
  },
  toast: {
    width: "80%",
  },
});
interface LoginReq {
  username: string;
  password: string;
}
