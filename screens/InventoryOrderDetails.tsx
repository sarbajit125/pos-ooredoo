import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { ColorConstants } from "../constants/Colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import OoredooPayBtn from "../components/OoredooPayBtn";
import OoredooCancelBtn from "../components/Core/OoredooCancelBtn";
import {
  POSInventoryCatelogManger,
  callInventoryApproval,
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
import InventoryHistoryModal from "../components/Inventory/InventoryHistoryModal";
import OoredooDialog from "../components/Core/OoredooDiaglog";

const InventoryOrderDetails = (props: InventoryDetailsNavProps) => {
  const detailsVM = fetchInventoryDetails(props.route.params.orderId);
  const catelogVM = POSInventoryCatelogManger();
  const [showError, setShowError] = useState<boolean>(false);
  const [showHistoryLog, toggleHistoryLog] = useState<boolean>(false);
  const [showAllocateLog, toggleAllocateLog] = useState<boolean>(false);
  const [showDialog, toggleDialog] = useState<boolean>(false);
  const [decisionType, setDecisionType] = useState<
    "ACK" | "APPROVE" | "REJECT"
  >("ACK");
  const approvalVM = callInventoryApproval(
    props.route.params.orderId.toString()
  );
  useEffect(() => {
    if (approvalVM.isSuccess) {
      let heading = `Approved Successfully ${approvalVM.data.orderId}`;
      switch (approvalVM.data.decision) {
        case "ACK":
          heading = `Acknowledged  Successfully ${approvalVM.data.orderId}`;
          break;
        case "REJECT":
          heading = `Rejected  Successfully ${approvalVM.data.orderId}`;
          break;
        default:
          heading = `Approved Successfully ${approvalVM.data.orderId}`;
          break;
      }
      props.navigation.navigate("POSSuccess", {
        resetTo: "Profile",
        heading: heading,
      });
    }
  }, [approvalVM.isSuccess]);
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
        valueTapped(key) {
          console.log(key);
          toggleHistoryLog(true);
        },
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
        valueTapped(key) {
          toggleAllocateLog(true);
        },
      },
    ];
  };

  const prepareActionButtons = (nextAction?: string) => {
    if (nextAction === undefined) {
      return null;
    } else {
      let btnTitle = "";
      let mutateType: "ACK" | "APPROVE" | "REJECT" = "ACK";
      switch (nextAction) {
        case "ACK":
        case "ACKF":
        case "ACKNOWLEDGEMENT":
          btnTitle = "Accept";
          mutateType = "ACK";
          break;
        case "APPROVE":
          btnTitle = "Approve";
          mutateType = "APPROVE";
          break;
        case "ALLOCATE":
        case "ALLOCATION":
          btnTitle = "Allocate";
          break;
        default:
          return null;
      }
      return (
        <View style={styles.btnView}>
          <OoredooPayBtn
            style={styles.buttons}
            onPress={() => {
              setDecisionType(mutateType);
              toggleDialog(true);
            }}
            title={btnTitle}
          />
          <OoredooCancelBtn
            style={styles.buttons}
            onPress={() => {
              setDecisionType("REJECT");
              toggleDialog(true);
            }}
            title={"Reject"}
          />
        </View>
      );
    }
  };
  const prepareDialog = () => {
    let descText = "";
    switch (decisionType) {
      case "ACK":
        descText = "Enter Remark for Inventory Acknowledge";
        break;
      case "APPROVE":
        descText = "Enter Remark for Inventory Approval";
        break;
      case "REJECT":
        descText = "Enter Remark for Inventory Rejection";
        break;
    }

    return (
      <OoredooDialog
        type={"textfield"}
        modalVisisble={showDialog}
        heading={"Please Confirm"}
        descText={descText}
        textInputProps={{
          placeholder: "Enter remark here",
          value: "",
        }}
        actionBtnCallback={function (
          approve: boolean,
          remark?: string | undefined
        ): void {
          if (approve) {
            approvalVM.mutate({
              type: decisionType,
              remarks: remark,
            });
          }
          toggleDialog(false);
        }}
      />
    );
  };
  const launchHistoryLogs = (data: InventoryOrderDetailsResponse) => {
    const requiredRows = data.orderHistory.map((item) => [
      item.actionBy,
      dayjs(item.actionDate).format(POSDateFormat).toString(),
      item.actionValue,
      item.remarks || "",
    ]);
    return (
      <InventoryHistoryModal
        heading={`Order Summary (${data.orderId})`}
        modalVisible={showHistoryLog}
        closeModalAction={() => toggleHistoryLog(false)}
        rows={requiredRows}
      />
    );
  };

  const launchAllocationLogs = (data: InventoryOrderDetailsResponse) => {
    let requiredRows: string[][] = [];
    if (data.grns != undefined && data.grns.length > 0) {
      requiredRows = data.grns[0].grnDetailList.map((item) => [
        item.inventoryType,
        item.allocatedQuantity.toString(),
        item.startSeries,
      ]);
    }
    return (
      <InventoryHistoryModal
        heading={`Allocation Summary (${data.orderId})`}
        modalVisible={showAllocateLog}
        closeModalAction={() => toggleAllocateLog(false)}
        rows={requiredRows}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {detailsVM.isSuccess && catelogVM.isSuccess ? (
        <View style={styles.compositeView}>
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
              {detailsVM.data.lineItems.map((item, index) => (
                <InventoryLogCell
                  rows={[
                    POSUtilityManager.sharedInstance().fetchNameFromInventoryCatelog(
                      item.inventoryTypeId,
                      catelogVM.data
                    ),
                    item.requestedQuantity.toString(),
                    item.transferredQuantity.toString(),
                    item.startSerial || "",
                  ]}
                  key={index}
                />
              ))}
            </View>
            {showHistoryLog ? launchHistoryLogs(detailsVM.data) : null}
            {showAllocateLog ? launchAllocationLogs(detailsVM.data) : null}
          </ScrollView>
          {prepareActionButtons(detailsVM.data.nextAction)}
        </View>
      ) : null}
      {detailsVM.isLoading || catelogVM.isLoading || approvalVM.isLoading ? (
        <OoredooActivityView />
      ) : null}
      {detailsVM.isError ? handleAPIError(detailsVM.error) : null}
      {approvalVM.isError ? handleAPIError(approvalVM.error) : null}
      {showDialog ? prepareDialog() : null}
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
    borderRadius: 8,
  },
  lineItemsHeaderView: {
    height: 40,
    borderBottomColor: ColorConstants.grey_AAA,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
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
  buttons: {
    flexBasis: "48%",
    marginHorizontal: 2,
  },
  compositeView: {
    flex: 1,
    flexGrow: 1,
  },
});
type InventoryDetailsNavProps = NativeStackScreenProps<
  RootStackParamList,
  "InventoryOrderDetails"
>;
