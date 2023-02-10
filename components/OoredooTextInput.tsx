import { StyleSheet } from "react-native";
import React from "react";
import { ColorConstants } from "../constants/Colors";
import { TextInput, TextInputProps } from "react-native-paper";

const OoredooTextInput = (props: TextInputProps) => {
  return (
    <TextInput
      mode="outlined"
      style={[styles.defaultStyles, props.style]}
      autoCorrect={false}
      placeholderTextColor={ColorConstants.grey_E0E}
      activeOutlineColor= {ColorConstants.grey_AAA}
      {...props}
    />
  );
};

export default OoredooTextInput;

const styles = StyleSheet.create({
  defaultStyles: {
    height: 48,
    borderRadius: 3,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: ColorConstants.grey_E0E,
    fontFamily: "NotoSans_400Regular",
    fontSize: 18,
    color: ColorConstants.black,
  },
});
