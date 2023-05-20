import { StyleSheet, Image, View, Text, SafeAreaView } from "react-native";
import React from "react";
import Header14Noto from "../components/OoredooFonts/Noto/Header14Noto";
import OoredooPayBtn from "../components/OoredooPayBtn";
import { ColorConstants } from "../constants/Colors";
import { Fontcache } from "../constants/FontCache";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type POSNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "POSSuccess"
>;
const POSSuccessSheet = ({ route, navigation }: POSNavigationProps) => {
  return (
    <SafeAreaView style={styles.containerView}  >
      <View style={styles.bottomSheet}  >
        <View style={styles.grabberView}></View>
        <View style={styles.mainView}>
          <Image
            source={require("../assets/images/thumbsSuccess.png")}
            style={styles.thumbsImage}
          />
          <Text style={styles.heading}>{route.params.heading}</Text>
          <Header14Noto style={styles.desc}>
            {route.params.desc ||
              "Please go to home page, to continue on further"}
          </Header14Noto>
        </View>
        <View style={styles.btnView}>
          <OoredooPayBtn
            onPress={() =>
              route.params.resetTo === "Profile"
                ? navigation.navigate("Profile")
                : navigation.navigate("Home")
            }
            title={route.params.btnTitle || "GO TO HOME"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default POSSuccessSheet;

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  bottomSheet:{
    marginTop:30,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: ColorConstants.white,
    flex: 1,
  },
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbsImage: {
    width: 170,
    height: 170,
  },
  heading: {
    marginVertical: 10,
    padding: 5,
    fontFamily: Fontcache.rubikBold,
    fontSize: 18,
    textAlign: "center",
    color: ColorConstants.grey_6D6,
  },
  desc: {
    textAlign: "center",
    padding: 5,
    color: ColorConstants.grey_6D6,
    width: "70%",
  },
  btnView: {
    marginVertical: 20,
    padding: 5,
    marginHorizontal: 8,
  },
  grabberView: {
    width: 48,
    height: 5,
    marginVertical: 5,
    backgroundColor: ColorConstants.grey_DFD,
    alignSelf: "center",
  },
});

export interface POSSuccessProps {
  btnTitle?: string;
  heading: string;
  desc?: string;
  okBtnAction: () => void;
}
