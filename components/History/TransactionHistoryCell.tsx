import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Fontcache } from "../../constants/FontCache";
import { ColorConstants } from "../../constants/Colors";

const TransactionHistoryCell = (props: HistoryCellData) => {
  return (
    <View style={styles.cell}>
      <View style={[styles.ribbon, { backgroundColor: props.ribbonColor }]} />
      <View style={styles.details}>
      <Text style={styles.heading}>{props.heading}</Text>
        {props.rows.map((item) =>(
          <View>
            <Text style={styles.rows}>{item.title}:</Text>
            <Text style={styles.rows}>{item.value}</Text>
          </View>
        ))}
        <Text style={[styles.heading, { color: props.statusColor }]}>
          {props.status}
        </Text>
        <TouchableOpacity style={styles.button} onPress={()=> props.btnPress()}>
          <Text style={styles.buttonText}>{props.btnTitle}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export interface HistoryCellData {
  rows: POSCellRowData[]
  heading: string;
  status: string;
  statusColor: string;
  btnTitle: string;
  ribbonColor: string;
  btnPress: () => void;
}
export interface POSCellRowData{
  title: string;
  value: string,
}

export default TransactionHistoryCell;

const styles = StyleSheet.create({
  cell: {
    flexDirection: "row",
    borderRadius: 10,
    width: "90%",
  },
  ribbon: {
    width: 5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  details: {
    marginHorizontal: 6,
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  rows: {
    flexBasis: "50%",
    fontFamily: Fontcache.notoRegular,
    fontSize: 14,
    color: ColorConstants.black,
  },
  heading: {
    flexBasis: "100%",
    fontFamily: Fontcache.notoRegular,
    fontSize: 18,
    color: ColorConstants.black,
  },
  button: {
    flexBasis: "50%",
    height: 35,
    borderWidth: 2,
    borderColor: ColorConstants.red_ED1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'flex-end',
  },
  buttonText: {
    fontFamily: Fontcache.notoRegular,
    fontSize: 14,
    color: ColorConstants.red_ED1,
  },
});
