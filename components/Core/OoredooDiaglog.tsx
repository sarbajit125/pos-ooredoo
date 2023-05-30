import { Modal, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ColorConstants } from "../../constants/Colors";
import { Fontcache } from "../../constants/FontCache";
import OoredooTextInput from "../OoredooTextInput";
import OoredooPayBtn from "../OoredooPayBtn";
import OoredooCancelBtn from "./OoredooCancelBtn";

const OoredooDialog = (props: OoredooDialogProps) => {
  const [inputText, setInputText] = useState<string>("");
  return (
    <Modal visible={props.modalVisisble} transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.headingView}>
            <Text style={styles.headingText}>{props.heading}</Text>
          </View>
          <View style={styles.descView}>
            <Text style={styles.descText}>{props.descText}</Text>
            {props.type === "textfield" && props.textInputProps != undefined ? (
              <OoredooTextInput
                value={inputText}
                placeholder={props.textInputProps.placeholder}
                onChangeText={(text) => {
                  setInputText(text);
                }}
                style={styles.RemarkField}
                showError={undefined}
              />
            ) : null}
          </View>
          <View style={styles.btnView}>
            <OoredooPayBtn
              onPress={() => props.actionBtnCallback(true, inputText)}
              title={props.okBtnName ?? "Ok"}
            />
            <OoredooCancelBtn
              onPress={() => props.actionBtnCallback(false, inputText)}
              title={props.okBtnName ?? "Cancel"}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OoredooDialog;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headingView: {
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: ColorConstants.grey_AAA,
  },
  headingText: {
    fontFamily: Fontcache.notoRegular,
    fontSize: 18,
    padding: 3,
  },
  descView: {
    flex: 1,
    alignItems: "center",
  },
  descText: {
    fontFamily: Fontcache.rubikBold,
    fontSize: 13,
    padding: 3,
  },
  RemarkField: {
    padding: 2,
    marginHorizontal: 6,
    marginVertical: 8,
  },
  btnView: {
    height: 50,
    flexDirection: "row",
  },
  btns: {
    flexBasis: 50,
    marginHorizontal: 5,
  },
});

export interface OoredooDialogProps {
  type: "none" | "textfield";
  modalVisisble: boolean;
  heading: string;
  descText: string;
  actionBtnCallback: (approve: boolean, remark?: string) => void;
  okBtnName?: string;
  cancelBtnName?: string;
  textInputProps?: {
    placeholder: string;
    value?: string;
  };
}
