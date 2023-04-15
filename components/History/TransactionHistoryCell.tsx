import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Fontcache } from "../../constants/FontCache";
import { ColorConstants } from "../../constants/Colors";

const TransactionHistoryCell = (props: HistoryCellData) => {
  return (
    <View style={styles.cell}>
      <View style={[styles.heading, { backgroundColor: props.ribbonColor }]} />
      <View style={styles.details}>
        <Text style={styles.heading}>{props.orderType}</Text>
        <Text style={styles.rows}>{props.orderId}:</Text>
        <Text style={styles.rows}>{props.orderIdValue}</Text>
        <Text style={styles.rows}>{props.orderDate}:</Text>
        <Text style={styles.rows}>{props.orderDateValue}</Text>
        <Text style={styles.rows}>{props.payment}:</Text>
        <Text style={styles.rows}>{props.paymentValue}</Text>
        <Text style={styles.rows}>{props.tax}:</Text>
        <Text style={styles.rows}>{props.taxValue}</Text>
        <Text style={styles.rows}>{props.closedby}:</Text>
        <Text style={styles.rows}>{props.closedByValue}</Text>
        <Text style={[styles.heading, { color: props.statusColor }]}>
          {props.status}
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{props.btnTitle}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export interface HistoryCellData {
  orderType: string;
  orderId: string;
  orderIdValue: string;
  orderDate: string;
  orderDateValue: string;
  payment: string;
  paymentValue: string;
  tax: string;
  taxValue: string;
  closedby: string;
  closedByValue: string;
  status: string;
  statusColor: string;
  btnTitle: string;
  ribbonColor: string;
}

export default TransactionHistoryCell;

const styles = StyleSheet.create({
  cell: {
    flexDirection: "row",
    borderRadius: 10,
    width: "90%",
  },
  ribbon: {
    width: 3,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  details: {
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
    flexBasis: "50%",
    fontFamily: Fontcache.notoRegular,
    fontSize: 18,
  },
  button: {
    width: 60,
    height: 35,
    borderWidth: 2,
    borderColor: ColorConstants.red_ED1,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: Fontcache.notoRegular,
    fontSize: 14,
    color: ColorConstants.red_ED1,
  },
});
