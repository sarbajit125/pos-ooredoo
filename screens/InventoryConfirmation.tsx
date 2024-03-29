import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { InventoryAllocateContext } from "../store/RootStore";
import {
  FetchInventoryProduct,
  FireSerialsForUser,
  InitateInventoryOrder,
  allocateInventory,
  checkResponseIfProduct,
  uploadMemoToRequest,
} from "../query-hooks/QueryHooks";
import { SafeAreaView } from "react-native-safe-area-context";
import OoredooTextInput from "../components/OoredooTextInput";
import OoredooPayBtn from "../components/OoredooPayBtn";
import OoredooActivityView from "../components/OoredooActivityView";
import OoredooBadReqView from "../components/errors/OoredooBadReqView";
import Header14RubikLbl from "../components/OoredooFonts/Rubik/Header14RubikLbl";
import {
  InventoryOrderReq,
  InventoryProductResponse,
} from "../responseModels/InventoryRulesResponse";
import { POSSelectData, RootStackParamList } from "../types";
import OoredooSelectionCell from "../components/Core/OoredooSelectionCell";
import { APIError } from "../responseModels/responseModels";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ColorConstants } from "../constants/Colors";
import { Fontcache } from "../constants/FontCache";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { InventoryLineItem } from "../responseModels/InventoryRulesResponse";
import UploadMemoBottomSheet from "../components/Core/UploadMemoBottomSheet";
import { POSDateFormat } from "../constants/AppConstants";
import dayjs from "dayjs";
import OoredooDialog from "../components/Core/OoredooDiaglog";
const InventoryConfirmation = (props: InventoryConfirmNavProps) => {
  const {
    type,
    productURL,
    selectedProductId,
    requestedQuantity,
    transferredQuantity,
    orderId,
  } = InventoryAllocateContext();
  const { data, isSuccess, isLoading, isError, error } =
    FetchInventoryProduct(productURL);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDialog, toggleDialog] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [enteredQuantity, setEnteredQuantity] = useState<string>("0");
  const [successOrderId, setOrderid] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] =
    useState<InventoryProductResponse>({
      currentStock: 0,
      erpInventoryId: "",
      inventoryTypeDescription: "",
      inventoryTypeid: 0,
      sequencial: "",
    });
  const [selectedSerials, setSelectedSerials] = useState<POSSelectData[]>([]);
  const {
    mutate,
    data: serialData,
    isSuccess: serialSuccess,
    isLoading: serialLoading,
    isError: serialError,
    error: serialErrData,
  } = FireSerialsForUser({
    invCategory: "Y",
    inventoryType: selectedProductId.toString(),
    poDateFrom: dayjs().subtract(6, "months").format(POSDateFormat),
    poDateTo: dayjs(new Date(Date.now())).format(POSDateFormat).toString(),
  });
  const {
    mutate: fireInventoryOrder,
    data: OrderSuccess,
    isSuccess: OrderIsSuccess,
    isLoading: OrderIsLoading,
    isError: OrderIsError,
    error: OrderDateError,
  } = InitateInventoryOrder();
  const allocationVM = allocateInventory(orderId);
  const uploadMemoVM = uploadMemoToRequest();
  // ref
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ["40%"], []);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  useEffect(() => {
    handleSerialAPIResponse();
  }, [serialSuccess, serialLoading, serialError]);

  useEffect(() => {
    handleProductlistResponse();
  }, [isSuccess, isLoading, isError]);

  useEffect(() => {
    handleOrderAPIResponse();
  }, [OrderIsSuccess, OrderIsError, OrderIsLoading]);

  useEffect(() => {
    if (uploadMemoVM.isSuccess) {
      navigateToSuccessScreen();
    }
  }, [uploadMemoVM.isSuccess, uploadMemoVM.isLoading]);
  useEffect(() => {
    handleAllocationAPIResponse();
  }, [allocationVM.isSuccess, allocationVM.isError]);

  const handleOrderAPIResponse = () => {
    if (OrderIsSuccess) {
      setOrderid(OrderSuccess.orderId);
      bottomSheetRef.current?.present();
    } else if (OrderIsError) {
      if (OrderDateError instanceof APIError) {
        setErrMsg(OrderDateError.message);
      } else {
        setErrMsg("SOMETHING WENT WRONG");
      }
      setShowModal(true);
    } else if (OrderIsLoading) {
    }
  };
  const navigateToSuccessScreen = () => {
    props.navigation.navigate("POSSuccess", {
      heading: `INVENTORY TRANSFER SUCCESSFULL ORDER ID: ${successOrderId}`,
      resetTo: "Profile",
    });
  };
  const handleProductlistResponse = () => {
    if (isSuccess) {
      if (!checkResponseIfProduct(data)) {
        const selectedObj = data.filter(
          (item) => item.inventoryTypeid === selectedProductId
        );
        if (selectedObj.length === 0) {
        } else {
          setSelectedProduct(selectedObj[0]);
          if (type === "P") {
            mutate();
          }
        }
      }
    } else if (isLoading) {
      return <OoredooActivityView />;
    } else if (isError) {
      if (error instanceof APIError) {
        setErrMsg(error.message);
      } else {
        setErrMsg("SOMETHING WENT WRONG");
      }
      setShowModal(true);
    } else {
      return <SafeAreaView></SafeAreaView>;
    }
  };
  const handleSerialAPIResponse = () => {
    if (serialSuccess) {
      const filteredData: POSSelectData[] = serialData
        .filter((item) => item.statusId === 4)
        .map((item) => ({
          id: item.inventorySerialNo,
          name: item.inventorySerialNo,
          isSelected: false,
        }));
      setSelectedSerials(filteredData);
    }
    if (serialLoading) {
      return <OoredooActivityView />;
    }
    if (serialError) {
      if (serialErrData instanceof APIError) {
        setErrMsg(serialErrData.message);
      } else {
        setErrMsg("SOMETHING WENT WRONG");
      }
      setShowModal(true);
    }
  };
  const tickCheckBox = (selectedObj: POSSelectData) => {
    setSelectedSerials((prevState) =>
      prevState.map((item) =>
        item.id == selectedObj.id
          ? { ...item, isSelected: !item.isSelected }
          : item
      )
    );
  };

  const renderCell = (cell: ListRenderItemInfo<POSSelectData>) => {
    return (
      <OoredooSelectionCell
        data={cell.item}
        selectionCallback={(item) => tickCheckBox(item)}
      />
    );
  };
  const prepareAllocateRequest = () => {
    allocationVM.mutate({
      productId: selectedProduct.inventoryTypeid,
      productName: selectedProduct.inventoryTypeDescription,
      serials: selectedSerials
        .filter((item) => item.isSelected)
        .map((item) => item.id),
    });
  };
  const handleAllocationAPIResponse = () => {
    if (allocationVM.isSuccess) {
      const heading = `Allocated Successfully for orderId: ${allocationVM.data.orderId}`;
      props.navigation.navigate("POSSuccess", {
        heading: heading,
        resetTo: "Profile",
      });
    } else if (allocationVM.isError) {
      if (allocationVM.error instanceof APIError) {
        setErrMsg(allocationVM.error.message);
      } else {
        setErrMsg("SOMETHING WENT WRONG");
      }
      setShowModal(true);
    }
  };
  const prepareInventoryRequest = () => {
    const splitArr = productURL.split("/");
    const reqLineItems: InventoryLineItem[] = selectedSerials
      .filter((item) => item.isSelected)
      .map((item) => ({
        lineNo: 1,
        startSerial: item.name,
        unitTypeId: 1,
        inventoryTypeId: selectedProduct.inventoryTypeid,
        inventoryTypeDescription: selectedProduct.inventoryTypeDescription,
        requestedQuantity: 1,
        poNo: "0",
        serialType: "serial",
        endSerial: item.name,
      }));
    let request: InventoryOrderReq = {
      orderMode: type,
      sourceChannelId: parseInt(splitArr[2]),
      targetChannelId: parseInt(splitArr[3]),
      transferTypeId: parseInt(splitArr[1]),
      lineItems:
        type === "P"
          ? reqLineItems
          : [
              {
                lineNo: 1,
                requestedQuantity: parseInt(enteredQuantity),
                unitTypeId: 1,
                inventoryTypeId: selectedProduct.inventoryTypeid,
                inventoryTypeDescription:
                  selectedProduct.inventoryTypeDescription,
              },
            ],
    };
    fireInventoryOrder(request);
  };
  const prepareDetailsViewForAllocation = () => {
    return (
      <View style={[styles.allocationDetails]}>
        <Header14RubikLbl style={styles.detailsheading}>
          Product details
        </Header14RubikLbl>
        <Text style={styles.detailsText}>
          Name: {selectedProduct.inventoryTypeDescription}
        </Text>
        <Text style={styles.detailsText}>
          Product Id: {selectedProduct.inventoryTypeid}
        </Text>
        <Text style={styles.detailsText}>
          Requested Quantity: {requestedQuantity}
        </Text>
        <Text style={styles.detailsText}>
          Transfered Quantity: {transferredQuantity}
        </Text>
        <Text style={styles.detailsText}>
          Selected Quantity:{" "}
          {selectedSerials.filter((item) => item.isSelected === true).length}
        </Text>
      </View>
    );
  };
  const prepareDetailsViewForConfirmation = () => {
    if (type === "R") {
      return (
        <View style={styles.detailsView}>
          <Header14RubikLbl style={styles.detailsheading}>
            {" "}
            Product details
          </Header14RubikLbl>
          <Text style={styles.detailsText}>
            Name: {selectedProduct.inventoryTypeDescription}
          </Text>
          <Text style={styles.detailsText}>
            Product Id: {selectedProduct.inventoryTypeid}
          </Text>
          <Text style={styles.detailsText}>
            Current Stock: {selectedProduct.currentStock}
          </Text>
        </View>
      );
    } else {
      <View style={styles.detailsView}>
        <Header14RubikLbl style={styles.detailsheading}>
          {" "}
          Product details
        </Header14RubikLbl>
        <Text style={styles.detailsText}>
          Name: {selectedProduct.inventoryTypeDescription}
        </Text>
        <Text style={styles.detailsText}>
          Product Id: {selectedProduct.inventoryTypeid}
        </Text>
        <Text style={styles.detailsText}>
          Selected Quantity:{" "}
          {selectedSerials.filter((item) => item.isSelected === true).length}
        </Text>
      </View>;
    }
  };
  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.mainContainer}>
        <View
          style={[
            { justifyContent: type === "P" ? "space-between" : "flex-start" },
            styles.topView,
          ]}
        >
          {props.route.params.screen === "Allocation"
            ? prepareDetailsViewForAllocation()
            : prepareDetailsViewForConfirmation()}
          {type === "R" ? (
            <View>
              <Header14RubikLbl style={styles.serialTableheading}>
                Request Quantity
              </Header14RubikLbl>
              <OoredooTextInput
                value={enteredQuantity}
                placeholder="Enter Quantity"
                onChangeText={(str) => setEnteredQuantity(str)}
                keyboardType="number-pad"
                showError={undefined}
                style={styles.textfield}
              />
            </View>
          ) : (
            <View style={styles.tableView}>
              <Header14RubikLbl style={styles.serialTableheading}>
                Available Serials
              </Header14RubikLbl>
              <FlatList
                data={selectedSerials}
                keyExtractor={(item) => item.id}
                renderItem={(item) => renderCell(item)}
                style={styles.serialTable}
              />
            </View>
          )}
        </View>
        <View style={styles.btnView}>
          <OoredooPayBtn
            onPress={() =>
              props.route.params.screen === "Confirmation"
                ? prepareInventoryRequest()
                :  toggleDialog(true)
            }
            title={"Confirm"}
          />
        </View>
        {isError || serialError || OrderIsError || allocationVM.isError ? (
          <OoredooBadReqView
            modalVisible={showModal}
            action={() => setShowModal(false)}
            title={errMsg}
          />
        ) : null}
        {showDialog ? (
          <OoredooDialog
            type={"none"}
            modalVisisble={showDialog}
            heading={"Please confirm"}
            descText={"Do you want approve for Inventory allocation"}
            actionBtnCallback={function (
              approve: boolean,
              remark?: string | undefined
            ): void {
              if (approve) {
                prepareAllocateRequest()
              } 
              toggleDialog(false)
            }}
          />
        ) : null}
        {allocationVM.isLoading ? <OoredooActivityView /> : null}
      </SafeAreaView>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleIndicatorStyle={{ display: "none" }}
        backgroundStyle={{ backgroundColor: "transparent" }}
      >
        <UploadMemoBottomSheet
          confirmBtnCallback={function (
            shouldUpload: boolean,
            selectedFile: string | null,
            orderId
          ): void {
            if (shouldUpload && selectedFile != null) {
              uploadMemoVM.mutate({
                orderId: orderId,
                selectedDoc: selectedFile,
              });
            } else {
              navigateToSuccessScreen();
            }
          }}
          orderId={successOrderId}
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
export default InventoryConfirmation;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexGrow: 1,
  },
  detailsView: {
    height: 100,
    backgroundColor: ColorConstants.white,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  allocationDetails: {
    height: 150,
    backgroundColor: ColorConstants.white,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  detailsheading: {
    padding: 3,
    marginHorizontal: 5,
  },
  detailsText: {
    padding: 3,
    marginHorizontal: 5,
    fontFamily: Fontcache.notoRegular,
    fontSize: 12,
    color: ColorConstants.black,
  },
  btnView: {
    marginVertical: 16,
    marginHorizontal: 8,
    padding: 5,
  },
  serialTable: {
    marginHorizontal: 8,
    marginTop: 5,
    marginBottom: 3,
    height: 300,
  },
  serialTableheading: {
    marginHorizontal: 8,
    padding: 3,
  },
  topView: {
    flex: 1,
    flexGrow: 1,
  },
  tableView: {},
  textfield: {
    marginHorizontal: 5,
  },
});
export interface InventoryConfirmationProps {
  type: "P" | "R";
  productURL: string;
  selectedProductId: number;
  requestedQuantity: number;
  transferredQuantity: number;
  orderId: number;
  setType: (type: "P" | "R") => void;
  setProductURL: (urlStr: string) => void;
  setProductId: (id: number) => void;
  setRequestedQuantity: (quantity: number) => void;
  setTransferredQuantity: (quantity: number) => void;
  setOrderId: (id: number) => void;
  reset: () => void;
}
type InventoryConfirmNavProps = NativeStackScreenProps<
  RootStackParamList,
  "InventoryConfirmation"
>;
