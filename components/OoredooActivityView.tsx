import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { ColorConstants } from "../constants/Colors";
import Header14Noto from "./OoredooFonts/Noto/Header14Noto";
import { Fontcache } from "../constants/FontCache";

const OoredooActivityView = () => {
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={ColorConstants.red_ED1} />
        <Header14Noto style={styles.message}>Loading...</Header14Noto>
      </View>
    </View>
  );
};

export default OoredooActivityView;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex:1,
    flexGrow:1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  message: {
    marginLeft: 10,
  },
});
