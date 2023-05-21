import {
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { fetchInventoryOrdersList } from "../query-hooks/QueryHooks";
import OoredooActivityView from "../components/OoredooActivityView";
import OoredooBadReqView from "../components/errors/OoredooBadReqView";
import { APIError } from "../responseModels/responseModels";
import { InventoryOrderListResponse } from "../responseModels/InventoryRulesResponse";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import TransactionHistoryCell, {
  POSCellRowData,
} from "../components/History/TransactionHistoryCell";
import dayjs from "dayjs";
import { POSUtilityManager } from "../AppManger/POSAppManager";

const InventoryOrderHistory = (props: InventoryOrdersHistory) => {
  const { data, isSuccess, isError, error, isLoading } =
    fetchInventoryOrdersList(
      dayjs().subtract(7,'days').format("YYYY-MM-DD"),
      dayjs(new Date(Date.now())).format("YYYY-MM-DD").toString()
    );

  const renderCell = (
    cellData: ListRenderItemInfo<InventoryOrderListResponse>
  ) => {
    const dataTobeDisplayed: POSCellRowData[] = [
      {
        title: "OrderType",
        value: POSUtilityManager.sharedInstance().fetchOrderTypeForList(
          cellData.item.transferTypeId
        ),
      },
      {
        title: "Order Date",
        value: dayjs(cellData.item.orderDate).format("DD-MM-YYYY").toString(),
      },
      { title: "Initated By", value: cellData.item.initiatedBy },
      { title: "Transfer To", value: "" },
      { title: "Pending With", value: cellData.item.nextActionBy },
    ];
    const fetchStatus =
      POSUtilityManager.sharedInstance().prepareStatusforInventoryOrdersList(
        cellData.item.orderStatusId
      );
    return (
      <View style={styles.cell}>
        <TransactionHistoryCell
          rows={dataTobeDisplayed}
          heading={`Order Id No.: ${cellData.item.orderId}`}
          status={fetchStatus.text}
          statusColor={fetchStatus.color}
          btnTitle={"View Details"}
          ribbonColor={fetchStatus.color}
          btnPress={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </View>
    );
  };

  if (isSuccess) {
    if (data.length === 0) {
      return (
        <SafeAreaView style={styles.safeArea}>
          <OoredooBadReqView
            modalVisible={true}
            action={() => props.navigation.goBack()}
            title={'NO DATA FOUND'}
          />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.safeArea}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.orderId.toString()}
            renderItem={(item) => renderCell(item)}
          />
        </SafeAreaView>
      );
    }
  } else if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <OoredooActivityView />
      </SafeAreaView>
    );
  } else if (isError) {
    let errMsg = "";
    if (error instanceof APIError) {
      errMsg = error.message;
    } else {
      errMsg = "SOMETHING WENT WRONG";
    }
    return (
      <SafeAreaView style={styles.safeArea}>
        <OoredooBadReqView
          modalVisible={true}
          action={() => props.navigation.goBack()}
          title={errMsg}
        />
      </SafeAreaView>
    );
  } else {
    return (
    <SafeAreaView>

    </SafeAreaView>
    )
  }
};

export default InventoryOrderHistory;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  cell: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
});

type InventoryOrdersHistory = NativeStackScreenProps<
  RootStackParamList,
  "InventoryOrderHistory"
>;
