import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
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
import TransactionHistoryCell, {
  POSCellRowData,
} from "../components/History/TransactionHistoryCell";
import { HistoryListResponse } from "../responseModels/HistoryListResponse";
import { ColorConstants } from "../constants/Colors";
import dayjs from "dayjs";
import { APIManager } from "../AppManger/ApiManger";
import { shareAsync } from "expo-sharing";
import { POSDateFormat, POSDownloadType } from "../constants/AppConstants";
import * as FileSystem from "expo-file-system";
const HistoryTable = (props: HistoryNavProps) => {
  useEffect(() => {
    switch (props.route.params.id) {
      case "transactionHistory":
        props.navigation.setOptions({ title: "Transaction History" });
        break;
      case "walletHistory":
        props.navigation.setOptions({ title: "Wallet History" });
        break;
    }
  }, []);
  const [orderType, setOrderType] = useState("");
  const [fromDate, setFromDate] = useState(
    dayjs().subtract(7, "days").format(POSDateFormat)
  );
  const [toDate, setEndDate] = useState(
    dayjs(new Date(Date.now())).format(POSDateFormat).toString()
  );
  const { data, isSuccess, error, isLoading } = TransactionHistoryHook(
    fromDate,
    toDate,
    orderType
  );
  const downloadFile = (
    receiptNumber: string,
    orderStatus: POSDownloadType
  ) => {
    const truncatedString = parseInt(receiptNumber).toFixed(0);
    const url = truncatedString + "/" + orderStatus;
    const filename = `${receiptNumber}.pdf`;
    APIManager.sharedInstance()
      .downloadReceipt(url, filename)
      .then((result) => saveFile(result, filename, "application/pdf"));
  };
  const saveFile = async (data: Blob, filename: string, mimetype: string) => {
    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(data);
    fileReaderInstance.onload = async () => {
      const base64data = fileReaderInstance.result?.split(",");
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
          console.log("Permission not granted");
        }
      } else {
        shareAsync(path, { mimeType: mimetype });
      }
    };
  };
  const renderCell = (item: ListRenderItemInfo<HistoryListResponse>) => {
    let btnTitle = "";
    let receiptNumber = "";
    let downloadType = POSDownloadType.Narrow;
    switch (item.item.orderType) {
      case "Physical Voucher":
      case "outstanding-bill-payment":
      case "accessories":
      case "InventorySale":
      case "add-on":
      case "E-Recharge":
      case "digital-sales":
      case "device":
        btnTitle = "Receipt Download";
        receiptNumber = item.item.receiptNumber;
        downloadType = POSDownloadType.Narrow;
        break;
      default:
        btnTitle = "SAF Download";
        receiptNumber = item.item.orderId;
        downloadType = POSDownloadType.Caf;
        break;
    }
    const receiptDate = dayjs(item.item.orderDate)
      .format("YYYY-MM-DD")
      .toString();
    const dataTobeDisplayed: POSCellRowData[] = [
      { title: "OrderId", value: item.item.orderId },
      { title: "OrderDate", value: receiptDate },
      { title: "Payment Amount", value: item.item.totalAmount.toString() },
      { title: "Tax Amount", value: item.item.taxAmount.toString() },
      { title: "Closed by", value: item.item.closedBy },
    ];
    return (
      <View style={styles.cell}>
        <TransactionHistoryCell
          rows={dataTobeDisplayed}
          heading={`OrderType: ${item.item.orderType}`}
          status={item.item.status || ""}
          statusColor={ColorConstants.green_20}
          btnTitle={btnTitle}
          ribbonColor={ColorConstants.green_20}
          btnPress={() => downloadFile(receiptNumber, downloadType)}
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
        <SafeAreaView style={styles.noDataView}>
          <Image
            source={require("../assets/images/NoDataFound.png")}
            style={styles.noDataImage}
          />
        </SafeAreaView>
      );
    }
  } else if (isLoading) {
    // Show loading overlay
    return (
      <SafeAreaView style={styles.container}>
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
    marginHorizontal: 10,
  },
  noDataView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataImage: {
    marginHorizontal: 4,
  },
  container:{
    flex:1
  }
});
