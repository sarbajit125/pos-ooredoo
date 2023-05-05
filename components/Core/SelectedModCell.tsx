import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import NotoRegular18 from "../OoredooFonts/Noto/NotoRegular18";
import OoredooModBtn from "../OoredooModBtn";
import { ColorConstants } from "../../constants/Colors";

const SelectedModCell = (props: SelectedModCellProps) => {
  return (
    <View key={props.id} style={styles.cell}>
      <NotoRegular18>{props.text}</NotoRegular18>
      <OoredooModBtn
        onPress={() => props.modifyCallback}
        style={styles.modBtn}
        title={props.buttonTitle || "Modify"}
      />
    </View>
  );
};

export default SelectedModCell;

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    flexDirection: "row",
    alignContent: "space-around",
    marginHorizontal: 16,
    alignItems: "center",
    height: 64,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: ColorConstants.grey_E0E
  },
  modBtn: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    width: 45,
    height: 15,
  },
});

export interface SelectedModCellProps {
  rightViewType: "none" | "button" | "image";
  text: string;
  id: string;
  buttonTitle?: string;
  modifyCallback: (id: string) => void;
}
