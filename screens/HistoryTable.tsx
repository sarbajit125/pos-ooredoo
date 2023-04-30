import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  FlatList,
  ListRenderItemInfo,
  Platform,
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
import dayjs from "dayjs";
import { APIManager } from "../AppManger/ApiManger";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";
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
  const downloadFile = (receiptNumber: string, orderStatus: number) => {
    const truncatedString = parseInt(receiptNumber).toFixed(0)
    const url =
      orderStatus == 7 ? `${truncatedString}/narrow` : `${truncatedString}/caf`;
    const filename = `${receiptNumber}.pdf`;
    APIManager.sharedInstance()
      .downloadReceipt(url, filename)
      .then((result) =>
        saveFile(
          result,
          filename,
          "application/pdf"
        )
      );
  };
  const saveFile = async (data: Blob, filename: string, mimetype: string) => {
    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(data);
    fileReaderInstance.onload =async () => {
      const base64data = fileReaderInstance.result.split(',');
      const pdfBuffer = base64data[1];
      const path = `${FileSystem.documentDirectory}/${filename}.pdf`;
      await FileSystem.writeAsStringAsync(path, pdfBuffer, {
        encoding: FileSystem.EncodingType.Base64,
      });
      if (Platform.OS == "android") {
        const permission =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permission.granted) {
              shareAsync(path, { mimeType: mimetype });
        } else {
          console.log("Permission not granted")
        }
      } else {
        shareAsync(path, { mimeType: mimetype });
      }
    }
  };
  const renderCell = (item: ListRenderItemInfo<HistoryListResponse>) => {
    let btnTitle =
      item.item.orderStatus == 7 ? "Receipt Download" : "SAF Download";
    const reciptDate = dayjs(item.item.orderDate)
      .format("YYYY-MM-DD")
      .toString();
    return (
      <View style={styles.cell}>
        <TransactionHistoryCell
          orderType={`OrderType: ${item.item.orderType}`}
          orderId={"OrderId: "}
          orderIdValue={item.item.orderId}
          orderDate={"OrderDate: "}
          orderDateValue={reciptDate}
          payment={"Payment Amount: "}
          paymentValue={item.item.totalAmount.toString()}
          tax={"Tax Amount:"}
          taxValue={item.item.taxAmount.toString()}
          closedby={"Closed by: "}
          closedByValue={item.item.closedBy}
          status={item.item.status || ""}
          statusColor={ColorConstants.green_20}
          btnTitle={btnTitle}
          ribbonColor={ColorConstants.red_ED1}
          btnPress={() =>
            downloadFile(item.item.receiptNumber, item.item.orderStatus)
          }
        />
      </View>
    );
  };
  if (isSuccess) {
    if (data.length != 0) {
      return (
        // Show table
        <SafeAreaView>
          <FlatList
            data={data}
            keyExtractor={(item) => item.orderId}
            renderItem={(item) => renderCell(item)}
          />
        </SafeAreaView>
      );
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
};

export default HistoryTable;
type HistoryNavProps = NativeStackScreenProps<
  RootStackParamList,
  "TransactionHistory"
>;
const styles = StyleSheet.create({
  cell: {
    marginVertical: 10,
  },
});
