import { StyleSheet, Text, View, Modal } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import OoredooPayBtn from "../OoredooPayBtn";
import OoredooCancelBtn from "./OoredooCancelBtn";
import { ColorConstants } from "../../constants/Colors";
const OoredooCalenderModal = (props: OoredooCalenderModalProps) => {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <Modal visible={props.showModal} transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.calenderView}>
            <DateTimePicker
            style={ styles.calender}
              value={date ?? new Date()}
              display="inline"
              mode="date"
              maximumDate={new Date()}
              minimumDate={new Date(2022, 1, 1)}
              textColor={ColorConstants.black}
              accentColor={ColorConstants.red_ED1}
              onChange={(event, selectedDate) => {
                if (event.type === 'set') {
                    console.log(selectedDate)
                    setDate(selectedDate)
                }
              }}
            />
          </View>
          <View style={styles.btnView}>
            <OoredooPayBtn
            style={styles.buttons}
              onPress={function (): void {
                props.actionBtnCallback(props.serviceCode, date)
              }}
              title={"Select"}
            />
            <OoredooCancelBtn
             style={styles.buttons}
              onPress={function (): void {
                props.cancelBtnCallback()
              }}
              title={"Cancel"}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OoredooCalenderModal;

export interface OoredooCalenderModalProps {
  showModal: boolean;
  actionBtnCallback: ( serviceCode: string, date?: Date) => void;
  cancelBtnCallback: () => void;
  serviceCode: string
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    marginTop: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 400,
  },
  btnView: {
    height: 40,
    flex: 1,
    flexDirection: "row",
    padding: 3,
    marginTop: 20,
  },
  calenderView: {
    marginTop:4,
    height:300,
  },
  calender:{
    flex:1,
    borderRadius:8,
  },
  buttons: {
    flexBasis: "48%",
    marginHorizontal: 3,
  },
});
