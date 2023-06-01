import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import { ColorConstants } from "../../constants/Colors";
import OoredooPayBtn from "../OoredooPayBtn";
import Header13RubikLbl from "../OoredooFonts/Rubik/Header13RubikLbl";
import Header14Noto from "../OoredooFonts/Noto/Header14Noto";
import { TouchableOpacity } from "react-native-gesture-handler";
import { POSDateFormat } from "../../constants/AppConstants";
import { Ionicons } from "@expo/vector-icons";
import SelectedModCell from "./SelectedModCell";

const OoredooFliterSheet = ({
  actionBtnCallback,
  serviceCode,
}: OoredooFilterSheetProps) => {
  const [fromDate, setFromDate] = useState<string>(POSDateFormat);
  const [toDate, setToDate] = useState<string>(POSDateFormat);
  const [serviceType, setServiceType] = useState<string>("All");
  const fetchServiceType = () => {
    switch (serviceCode) {
        case 'transactionHistory':


    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.datesView}>
        <View style={styles.selectionView}>
          <Header13RubikLbl style={styles.heading}>Start Date</Header13RubikLbl>
          <View style={styles.selections}>
            <Header14Noto style={styles.dateText}>{fromDate}</Header14Noto>
            <TouchableOpacity style={styles.calenderIconView}>
              <Ionicons name="ios-calendar-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.selectionView}>
          <Header13RubikLbl style={styles.heading}>End Date</Header13RubikLbl>
          <View style={styles.selections}>
            <Header14Noto style={styles.dateText}>{fromDate}</Header14Noto>
            <TouchableOpacity style={styles.calenderIconView}>
              <Ionicons name="ios-calendar-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.typeView}>
        <SelectedModCell
          rightViewType={"button"}
          text={serviceType}
          id={"searchType"}
          modifyCallback={(id) => {
            console.log(id);
          }}
          heading="Select Service Type"
        />
      </View>
      <View style={styles.btnView}>
        <OoredooPayBtn
          onPress={() => actionBtnCallback(fromDate, toDate, serviceType)}
          title={"Confirm"}
        />
      </View>
    </View>
  );
};

export default OoredooFliterSheet;

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorConstants.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flex: 1,
  },
  datesView: {
    flexDirection: "row",
    marginVertical: 4,
  },
  selectionView: {
    flexBasis: "48%",
    marginHorizontal: 2,
  },
  selections: {
    borderWidth: 2,
    borderColor: ColorConstants.grey_898,
    flexDirection: "row",
    height:50,
    alignItems:'center',
  },
  dateText: {
    flex: 1,
    padding: 3,
    marginLeft:3,
  },
  calenderIconView: {
    width: 25,
    height: 25,
    marginHorizontal:4,
  },
  typeView: {
    height:90,
  },
  btnView: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  heading:{
    marginVertical:2,
    padding:3,
  },
});
export interface OoredooFilterSheetProps {
  actionBtnCallback: (
    fromDate: string,
    endDate: string,
    serviceType: string
  ) => void;
  serviceCode: string;
}
