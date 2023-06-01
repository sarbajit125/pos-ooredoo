import {
  FlatList,
  ImageBackground,
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet,
  Image,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import { POSDateFormat } from "../constants/AppConstants";

const InventoryOrderHistory = (props: InventoryOrdersHistory) => {
  const [showError, setShowError] = useState<boolean>(false);
  const [errMsg, setErrMSg] = useState<string>("");
  const { data, isSuccess, isError, error, isLoading } =
    fetchInventoryOrdersList(
      dayjs().subtract(7, "days").format(POSDateFormat),
      dayjs(new Date(Date.now())).format(POSDateFormat).toString()
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
            props.navigation.navigate("InventoryOrderDetails", {
              orderId: cellData.item.orderId,
              type: "InventoryDetails",
            });
          }}
        />
      </View>
    );
  };
  const prepareList = (data: InventoryOrderListResponse[]) => {
    if (data.length === 0) {
      return (
        <View style={styles.noDataView}>
            <Image style={styles.noDataImage} source={require('../assets/images/NoDataFound.png')} />
        </View>
      )
    } else {
      return (
        <FlatList
          data={data}
          keyExtractor={(item) => item.orderId.toString()}
          renderItem={(item) => renderCell(item)}
        />
      );
    }
  };
  useEffect(()=>{
    if (isError) {
      if (error instanceof APIError) {
        setErrMSg(error.message)
      } else {
        setErrMSg('SOMETHING WENT WRONG')
      }
      setShowError(true)
    }
  },[isError])
  return (
    <SafeAreaView style={styles.safeArea}>
      {isSuccess ? prepareList(data) : null}
      {isLoading ? <OoredooActivityView /> : null}
      {showError ? (
        <OoredooBadReqView
          modalVisible={showError}
          action={function (): void {
            setShowError(false);
            props.navigation.goBack();
          }}
          title={errMsg}
        />
      ) : null}
    </SafeAreaView>
  );
};
export default InventoryOrderHistory;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    flexGrow:1,
  },
  cell: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  noDataView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  noDataImage:{
    marginHorizontal:4,
  },
});

type InventoryOrdersHistory = NativeStackScreenProps<
  RootStackParamList,
  "InventoryOrderHistory"
>;
