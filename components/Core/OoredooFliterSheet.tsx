import {
  StyleSheet,
  View,
  TouchableOpacity,
  DatePickerIOSBase,
} from "react-native";
import React, { useState } from "react";
import { ColorConstants } from "../../constants/Colors";
import OoredooPayBtn from "../OoredooPayBtn";
import Header13RubikLbl from "../OoredooFonts/Rubik/Header13RubikLbl";
import Header14Noto from "../OoredooFonts/Noto/Header14Noto";
import { POSDateFormat } from "../../constants/AppConstants";
import { Ionicons } from "@expo/vector-icons";
import { fetchDropdownsOrderedById } from "../../query-hooks/QueryHooks";
import { Dropdown } from "react-native-element-dropdown";
import { Fontcache } from "../../constants/FontCache";
import OoredooCalenderModal from "./OoredooCalenderModal";
import dayjs from "dayjs";
const OoredooFliterSheet = ({
  actionBtnCallback,
  serviceCode,
}: OoredooFilterSheetProps) => {
  const [fromDate, setFromDate] = useState<string>(POSDateFormat);
  const [toDate, setToDate] = useState<string>(POSDateFormat);
  const [serviceType, setServiceType] = useState<string>("");
  const [serviceName, setServiceName] = useState<string>("");
  const orderSubTypeVM = fetchDropdownsOrderedById(serviceCode);
  const [showPicker, togglePicker] = useState<boolean>(false);
  const [calenderType, setCalenderType] = useState<string>("");
  return (
    <View style={styles.container}>
      <View style={styles.datesView}>
        <View style={styles.selectionView}>
          <Header13RubikLbl style={styles.heading}>Start Date</Header13RubikLbl>
          <View style={styles.selections}>
            <Header14Noto style={styles.dateText}>{fromDate}</Header14Noto>
            <TouchableOpacity
              style={styles.calenderIconView}
              onPress={() => {
                setCalenderType("startDate");
                togglePicker(true);
              }}
            >
              <Ionicons name="ios-calendar-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.selectionView}>
          <Header13RubikLbl style={styles.heading}>End Date</Header13RubikLbl>
          <View style={styles.selections}>
            <Header14Noto style={styles.dateText}>{toDate}</Header14Noto>
            <TouchableOpacity
              style={styles.calenderIconView}
              onPress={() => {
                setCalenderType("endDate");
                togglePicker(true);
              }}
            >
              <Ionicons name="ios-calendar-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {orderSubTypeVM.isSuccess ? (
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          maxHeight={200}
          data={orderSubTypeVM.data}
          labelField="name"
          valueField="id"
          value={serviceType}
          dropdownPosition="top"
          onChange={(item) => {
            console.log(item.name);
            setServiceName(item.name);
            setServiceType(item.id);
          }}
        />
      ) : null}
      {showPicker ? (
        <OoredooCalenderModal
          showModal={showPicker}
          serviceCode={calenderType}
          actionBtnCallback={(serviceCode, date) => {
            if (serviceCode === "startDate") {
              setFromDate(dayjs(date).format(POSDateFormat));
            } else {
              setToDate(dayjs(date).format(POSDateFormat));
            }
            togglePicker(false);
          }}
          cancelBtnCallback={function (): void {
            togglePicker(false);
          }}
        />
      ) : null}
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
    height: 50,
    alignItems: "center",
  },
  dateText: {
    flex: 1,
    padding: 3,
    marginLeft: 3,
  },
  calenderIconView: {
    width: 25,
    height: 25,
    marginHorizontal: 4,
  },
  dropdown: {
    height: 50,
    borderColor: ColorConstants.grey_898,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 3,
  },
  btnView: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  heading: {
    marginVertical: 2,
    padding: 3,
  },
  placeholderStyle: {
    fontFamily: Fontcache.notoRegular,
    fontSize: 14,
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
