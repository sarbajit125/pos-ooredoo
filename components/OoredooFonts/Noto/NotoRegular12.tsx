import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TextProps } from "react-native-paper";
import { ColorConstants } from "../../../constants/Colors";
import { observer } from "mobx-react";

 const NotoRegular12 = (props: TextProps) => {
  return (
    <Text style={[styles.default, props.style]} {...props}>
      {props.children}
    </Text>
  );
}
export default NotoRegular12
const styles = StyleSheet.create({
  default: {
    fontFamily: "NotoSans_400Regular",
    fontSize: 12,
    color: ColorConstants.black,
  },
});
