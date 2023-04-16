import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { TransactionHistoryHook } from "../query-hooks/QueryHooks";
import OoredooActivityView from "../components/OoredooActivityView";
import OoredooBadReqView from "../components/errors/OoredooBadReqView";
import TransactionHistoryCell from "../components/History/TransactionHistoryCell";
import { HistoryListResponse } from "../responseModels/HistoryListResponse";
import { ColorConstants } from "../constants/Colors";

const HistoryTable = (props: HistoryNavProps) => {
  useEffect(() => {
    switch (props.route.params.id) {
      case "transactionHistory":
        props.navigation.setOptions({ title: "Transaction History" });
      case "walletHistory":
        props.navigation.setOptions({ title: "Wallet History" });
    }
  }, []);
  const { data, isSuccess, error, isLoading } = TransactionHistoryHook();
  const [orderType, setOrderType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setEndDate] = useState("");
  if (isSuccess) {
    if (data.length != 0) {
      // Show table
      <SafeAreaView>
        <FlatList
          data={data}
          keyExtractor={(item) => item.orderId}
          renderItem={(item) => renderCell(item)}
        />
      </SafeAreaView>;
    } else {
      // Show no data found
      return (
        <SafeAreaView>
          <ImageBackground
            source={require("../assets/images/NoDataFound.png")}
            resizeMode="cover"
          ></ImageBackground>
        </SafeAreaView>
      );
    }
  } else if (isLoading) {
    // Show loading overlay
    return (
      <SafeAreaView>
        <OoredooActivityView />
      </SafeAreaView>
    );
  } else {
    // show error overlay
    return (
      <SafeAreaView>
        <OoredooBadReqView
          modalVisible={true}
          action={() => props.navigation.goBack()}
          title={"API error"}
        />
      </SafeAreaView>
    );
  }
  const renderCell = (item: ListRenderItemInfo<HistoryListResponse>) => {
    let btnTitle = item.item.orderStatus == 7 ?  "Receipt Download" : "SAF Download"
    return (
      <TransactionHistoryCell
        orderType={`OrderType: ${item.item.orderType}`}
        orderId={"OrderId: "}
        orderIdValue={item.item.orderId}
        orderDate={"OrderDate: "}
        orderDateValue={item.item.orderDate.toUTCString()}
        payment={"Payment Amount: "}
        paymentValue={item.item.totalAmount.toString()}
        tax={"Tax Amount:"}
        taxValue={item.item.taxAmount.toString()}
        closedby={"Closed by: "}
        closedByValue={item.item.closedBy}
        status={item.item.status ||""}
        statusColor={ColorConstants.green_20}
        btnTitle={btnTitle}
        ribbonColor={ColorConstants.green_20}
      />
    );
  };
};

export default HistoryTable;
type HistoryNavProps = NativeStackScreenProps<
  RootStackParamList,
  "TransactionHistory"
>;
const styles = StyleSheet.create({});
