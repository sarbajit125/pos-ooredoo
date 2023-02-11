import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Header14Noto from "./OoredooFonts/Noto/Header14Noto";
import OoredooTextInput from "./OoredooTextInput";
import { AppConstants } from "../constants/AppConstants";
import { ColorConstants } from "../constants/Colors";

const OoredooPinModal = (props: OoredooPINProps) => {
  const [pin, setPin] = useState("");
  const [isEnabled, setEnable] = useState(false);
  const handleTextChange = (text: string) => {
    setPin(text);
    if (text.length == AppConstants.faisaPINLength) {
        setEnable(true);
    } else {
      setEnable(false);
    }
  };
  const handleBtnPress = () => {
    if (isEnabled) {
        props.returnPrin(pin);
    }     
  };
  return (
    <Modal
      transparent={true}
      animationType="slide"
      onRequestClose={props.onDismiss}
      onDismiss={props.onDismiss}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Header14Noto>
            {`Enter pin for wallet ${props.walledId}`}
          </Header14Noto>
          <OoredooTextInput
            placeholder="PIN"
           
            style={styles.textInput}
            onChangeText={(text) => handleTextChange(text)}
            maxLength= {AppConstants.faisaPINLength}
            keyboardType="number-pad"
            defaultValue=""
          />
          <TouchableOpacity
            style={{
                backgroundColor: ColorConstants.red_ED1,
                width: 120,
                height: 30,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                padding: 5,
                opacity: isEnabled ? 1.0 : 0.5
            }}
            onPress={handleBtnPress}
          >
            <Text style={styles.btnText}> OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default OoredooPinModal;
type OoredooPINProps = {
  show: boolean;
  walledId: string;
  returnPrin: (pin: string) => void;
  onDismiss: () => void;
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: ColorConstants.red_ED1,
    width: 120,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    padding: 5,
  },
  btnText: {
    
    color: ColorConstants.white,
    fontFamily: "NotoSans_400Regular",
    fontSize: 14,
  },
  textInput:{
    width: 120,
  },
});
