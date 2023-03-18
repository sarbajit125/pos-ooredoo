import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ColorConstants } from "../constants/Colors";
import { ViewStyle } from "react-native";

const OoredooPayBtn = (props: PayBtnProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.btnView,
        props.style,
        props?.isDisabled ? styles.disabled : styles.enabled,
      ]}
      onPress={props.onPress}
      activeOpacity={0.5}
      disabled={props.isDisabled}
    >
      <Text style={[styles.btnText]}>{props.title}</Text>
    </TouchableOpacity>
  );
};
export default OoredooPayBtn;

const styles = StyleSheet.create({
  btnView: {
    height: 48,
    backgroundColor: ColorConstants.red_ED1,
    borderRadius: 50,
    justifyContent: "center",
  },
  btnText: {
    fontFamily: "Rubik_700Bold",
    fontSize: 12,
    lineHeight: 14,
    alignSelf: "center",
    color: ColorConstants.white,
  },
  disabled: {
    opacity: 0.5,
  },
  enabled: {
    opacity: 1.0,
  },
});

type PayBtnProps = {
  onPress: () => void;
  style?: ViewStyle;
  title: string;
  isDisabled?: boolean;
};
