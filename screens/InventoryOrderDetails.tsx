import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { ColorConstants } from "../constants/Colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import OoredooPayBtn from "../components/OoredooPayBtn";
import OoredooCancelBtn from "../components/Core/OoredooCancelBtn";
import {
  POSInventoryCatelogManger,
  fetchInventoryDetails,
} from "../query-hooks/QueryHooks";
import OoredooActivityView from "../components/OoredooActivityView";
import { APIError } from "../responseModels/responseModels";
import OoredooBadReqView from "../components/errors/OoredooBadReqView";
import InventoryDetailCard, {
  InventoryCardRows,
} from "../components/Inventory/InventoryDetailCard";
import { InventoryOrderDetailsResponse } from "../responseModels/InventoryOrderDetailsResponse";
import dayjs from "dayjs";
import { POSDateFormat } from "../constants/AppConstants";
import { POSUtilityManager } from "../AppManger/POSAppManager";
import { Fontcache } from "../constants/FontCache";
import InventoryLogCell from "../components/Inventory/InventoryLogCell";

const InventoryOrderDetails = (props: InventoryDetailsNavProps) => {
  const detailsVM = fetchInventoryDetails(props.route.params.orderId);
 // const catelogVM = POSInventoryCatelogManger();
  const [showError, setShowError] = useState<boolean>(false);
  const handleAPIError = (error: unknown) => {
    let errMsg = "";
    if (error instanceof APIError) {
      errMsg = error.message;
    } else {
      errMsg = "SOMETHING WENT WRONG";
    }
    setShowError(true);
    return (
      <OoredooBadReqView
        modalVisible={showError}
        action={function (): void {
          setShowError(true);
        }}
        title={errMsg}
      />
    );
  };
  const prepareHeaderCell = (
    data: InventoryOrderDetailsResponse
  ): InventoryCardRows[] => {
    return [
      {
        key: "Order Date:",
        type: "text",
        value: dayjs(data.orderDate).format(POSDateFormat),
      },
      { key: "Source:", type: "text", value: data.sourceChannelName },
      { key: "Target:", type: "text", value: data.targetChannelName },
      {
        key: "Order Status:",
        type: "text",
        value:
          POSUtilityManager.sharedInstance().prepareStatusforInventoryOrdersList(
            data.orderStatusId
          ).text,
      },
      {
        key: "Order History:",
        type: "image",
        imageURL: require("../assets/images/inventory_orderDetails_icon.png"),
      },
      {
        key: "Memo Download:",
        type: "image",
        imageURL: require("../assets/images/inventory_memo_icon.png"),
      },
      {
        key: "Allocation History:",
        type: "image",
        imageURL: require("../assets/images/inventory_orderDetails_icon.png"),
      },
    ];
  };

  const prepareActionButtons = (nextAction?: string) => {
    if (nextAction === undefined) {
      return null;
    } else {
      switch (nextAction) {
        case "ACK":
        case "ACKF":
        case "ACKNOWLEDGEMENT":
          return (
            <View style={styles.btnView}>
              <OoredooPayBtn
                onPress={function (): void {
                  throw new Error("Function not implemented.");
                }}
                title={"Accept"}
              />
              <OoredooCancelBtn
                onPress={function (): void {
                  throw new Error("Function not implemented.");
                }}
                title={"Reject"}
              />
            </View>
          );
        case "APPROVE":
          return (
            <View style={styles.btnView}>
              <OoredooPayBtn
                onPress={function (): void {
                  throw new Error("Function not implemented.");
                }}
                title={"Approve"}
              />
              <OoredooCancelBtn
                onPress={function (): void {
                  throw new Error("Function not implemented.");
                }}
                title={"Reject"}
              />
            </View>
          );
        case "ALLOCATE":
        case "ALLOCATION":
          return (
            <View style={styles.btnView}>
              <OoredooPayBtn
                onPress={function (): void {
                  throw new Error("Function not implemented.");
                }}
                title={"Allocate"}
              />
              <OoredooCancelBtn
                onPress={function (): void {
                  throw new Error("Function not implemented.");
                }}
                title={"Reject"}
              />
            </View>
          );
        default:
          return null;
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {detailsVM.isSuccess ? (
        <ScrollView>
          <View style={styles.topView}>
            <InventoryDetailCard
              orderHeading={`Order Summary: ${detailsVM.data.orderId.toString()}`}
              rows={prepareHeaderCell(detailsVM.data)}
            />
          </View>
          <View style={styles.lineItemsView}>
            <View style={styles.lineItemsHeaderView}>
              <Text style={styles.lineItemHeaderText}> Name </Text>
              <Text style={styles.lineItemHeaderText}> RQuantity </Text>
              <Text style={styles.lineItemHeaderText}> TQuantity </Text>
              <Text style={styles.lineItemHeaderText}> Serials</Text>
            </View>
            {/* {detailsVM.data.lineItems.map((item) => (
              <InventoryLogCell
                rows={[
                  catelogVM.isSuccess
                    ? POSUtilityManager.sharedInstance().fetchNameFromInventoryCatelog(
                        item.inventoryTypeId,
                        catelogVM.data
                      )
                    : item.inventoryTypeId.toString(),
                  item.inventoryTypeId.toString(),
                  item.requestedQuantity.toString(),
                  item.transferredQuantity.toString(),
                  item.lineNo.toString(),
                ]}
              />
            ))} */}
          </View>
          {prepareActionButtons(detailsVM.data.nextAction)}
        </ScrollView>
      ) : null}
      {detailsVM.isLoading  ? (
        <OoredooActivityView />
      ) : null}
      {detailsVM.isError ? handleAPIError(detailsVM.error) : null}
    </SafeAreaView>
  );
};

export default InventoryOrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topView: {
    height: 250,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  lineItemsView: {
    flex: 1,
    borderWidth: 1,
    borderColor: ColorConstants.grey_898,
    marginVertical: 8,
    marginHorizontal: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  lineItemsHeaderView: {
    height: 40,
    borderBottomColor: ColorConstants.grey_AAA,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems:'center',
  },
  lineItemHeaderText: {
    fontFamily: Fontcache.notoRegular,
    fontSize: 14,
    padding: 5,
    flexBasis: "25%",
  },
  btnView: {
    height: 60,
    flexDirection: "row",
    marginVertical: 16,
    padding: 2,
  },
});
type InventoryDetailsNavProps = NativeStackScreenProps<
  RootStackParamList,
  "InventoryOrderDetails"
>;
