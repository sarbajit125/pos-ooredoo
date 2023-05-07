import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import NotoRegular18 from "../OoredooFonts/Noto/NotoRegular18";
import OoredooModBtn from "../OoredooModBtn";
import { ColorConstants } from "../../constants/Colors";
import Header13RubikLbl from "../OoredooFonts/Rubik/Header13RubikLbl";

const SelectedModCell = (props: SelectedModCellProps) => {
  switch (props.rightViewType) {
    case "button":
      return (
        <View
          key={props.id}
          style={[
            { height: props.heading === undefined ? 70 : 94 },
            styles.mainView,
          ]}
        >
          {props.heading === undefined ? null : (
            <Header13RubikLbl style={styles.heading}>
              {props.heading}
            </Header13RubikLbl>
          )}
          <View style={styles.cell}>
            <NotoRegular18 style={styles.text}>{props.text}</NotoRegular18>
            <OoredooModBtn
              onPress={() => props.modifyCallback(props.id)}
              style={styles.modBtn}
              title={props.buttonTitle || "Modify"}
            />
          </View>
        </View>
      );
    case "image":
      return (
        <View key={props.id} style={styles.mainView}>
          <View key={props.id} style={styles.cell}>
            <NotoRegular18 style={styles.text}>{props.text}</NotoRegular18>
            <Image
              style={styles.image}
              source={require("../../assets/images/dropDownArrow.png")}
            />
          </View>
        </View>
      );
    case "none":
      return (
        <View key={props.id} style={styles.mainView}>
          <Header13RubikLbl style={styles.heading}>
            {props.heading}
          </Header13RubikLbl>
          <View style={styles.cell}>
            <NotoRegular18 style={styles.text}>{props.text}</NotoRegular18>
          </View>
        </View>
      );
  }
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
    borderColor: ColorConstants.grey_E0E,
    backgroundColor: ColorConstants.white,
    marginVertical: 5,
  },
  text: {
    marginHorizontal: 10,
    flexGrow: 1,
    width: 80,
  },
  modBtn: {
    marginHorizontal: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    width: 70,
  },
  image: {
    height: 10,
    width: 5,
    marginHorizontal: 10,
  },
  mainView: {
    marginTop: 5,
    height: 90,
  },
  heading: {
    marginHorizontal: 16,
  },
});

export interface SelectedModCellProps {
  rightViewType: "none" | "button" | "image";
  text: string;
  id: string;
  buttonTitle?: string;
  modifyCallback: (id: string) => void;
  heading?: string;
}
