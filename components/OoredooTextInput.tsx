import { StyleSheet, View } from "react-native";
import React from "react";
import { ColorConstants } from "../constants/Colors";
import { TextInput, TextInputProps } from "react-native-paper";
import ValidationErrLbl from "./ValidationErrLbl";

const OoredooTextInput = (props: OoredooTextInputProps) => {
  return (
    <View>
      <TextInput
        mode="outlined"
        style={[styles.defaultStyles, props.showError ? {borderColor: ColorConstants.red_ED1} : {borderColor: ColorConstants.grey_E0E} ]}
        autoCorrect={false}
        placeholderTextColor={ColorConstants.grey_E0E}
        activeOutlineColor= {ColorConstants.grey_AAA}
        {...props}
      />
      {props.showError && <ValidationErrLbl>{props.errorMsg || "Error"}</ValidationErrLbl>}
    </View>
  );
};
export default OoredooTextInput;
export interface OoredooTextInputProps extends TextInputProps {
  errorMsg?: string
  showError: boolean | "" | undefined
}

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
