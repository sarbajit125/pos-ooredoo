import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorConstants } from "../../constants/Colors";
const OoredooFilterBtn = (props: OoredooFilterBtnProps) => {
  return (
    <TouchableOpacity
      style={[props.styles ,styles.container]}
      onPress={() => props.btnCallback()}
    >
      <MaterialCommunityIcons name="air-filter" size={25} color="grey" />
    </TouchableOpacity>
  );
};

export default OoredooFilterBtn;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: ColorConstants.red_ED1,
  },
});

export interface OoredooFilterBtnProps {
  btnCallback: () => void;
  styles: ViewStyle
}
