import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  InventorySaleScreen,
  POSAPIHelper,
  POSSelectData,
  RootStackParamList,
} from "../types";
import SelectedModCell from "../components/Core/SelectedModCell";
import { SearchScreenContext } from "../store/RootStore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FetchInventoryRules1 } from "../query-hooks/QueryHooks";
import { APIError } from "../responseModels/responseModels";
import OoredooPayBtn from "../components/OoredooPayBtn";
import OoredooBadReqView from "../components/errors/OoredooBadReqView";

const InventorySaleRepacked = (props: InventorySaleProps) => {
  const [rows, setRows] = useState<InventoryList[]>([
    {
      id: InventorySaleScreen.Entry,
      selectedData: undefined,
    },
    {
      id: InventorySaleScreen.Type,
      selectedData: undefined,
    },
    {
      id: InventorySaleScreen.Source,
      selectedData: undefined,
    },
    {
      id: InventorySaleScreen.Target,
      selectedData: undefined,
    },
    {
      id: InventorySaleScreen.Product,
      selectedData: undefined,
    },
  ]);
  const [requestParams, setRequestParams] = useState<string>("");
  const [errorMSg, setErrmsg] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [apiAction, setApiAction] = useState<POSAPIHelper>(POSAPIHelper.None);
  const {
    data,
    setData,
    selectedData,
    setServiceCode,
    serviceCode,
    setSelectedData,
  } = SearchScreenContext();
  let apiResponse = FetchInventoryRules1(requestParams);
  useEffect(() => {
    setSelectedData(undefined);
  }, []);
  useEffect(() => {
    if (selectedData === undefined) {
      console.log("Undefined");
    } else {
      setRows((prevState) =>
        prevState.map((item) =>
          item.id == serviceCode
            ? { ...item, selectedData: selectedData.selectedData?.[0] }
            : item
        )
      );
    }
  }, [selectedData]);
  useEffect(() => {
    if (requestParams === "") {
      console.log("Don't fire API");
    } else {
      apiResponse.refetch();
    }
  }, [requestParams]);
  useEffect(() => {
    handleAPIResponse();
  }, [apiResponse.isSuccess, apiResponse.isError, apiResponse.isLoading]);
  const prepareDataForSearch = (service: InventorySaleScreen) => {
    setServiceCode(service);
    let query = "";
    switch (service) {
      case InventorySaleScreen.Entry:
        setData([
          { id: "P", name: "Push", isSelected: false },
          { id: "R", name: "Request", isSelected: false },
        ]);
        props.navigation.navigate("SearchScreen");
        break;
      case InventorySaleScreen.Type:
        query = rows[0].selectedData?.id || "";
        query = query + "/transferTypes";
        break;
      case InventorySaleScreen.Source:
        query = `${rows[0].selectedData?.id || ""}/${
          rows[1].selectedData?.id || ""
        }`;
        query = query + "/sources";
        break;
      case InventorySaleScreen.Target:
        query = `${rows[0].selectedData?.id || ""}/${
          rows[1].selectedData?.id || ""
        }/${rows[2].selectedData?.id || ""}`;
        query = query + "/targets";
        break;
      case InventorySaleScreen.Product:
        query = `${rows[0].selectedData?.id || ""}/${
          rows[1].selectedData?.id || ""
        }/${rows[2].selectedData?.id || ""}/${rows[3].selectedData?.id || ""}`;
        query = query + "/products";
        break;
      default:
      // do nothing
    }
    console.log(query);
    setRequestParams(query);
  };
  const handleAPIResponse = () => {
    if (apiResponse.isSuccess) {
      if (apiResponse.data.length == 0) {
        setErrmsg("NO DATA FOUND");
        setApiAction(POSAPIHelper.isError);
          setShowModal(true);
      } else {
         setApiAction(POSAPIHelper.None);
        setShowModal(false);
        setData(apiResponse.data);
        props.navigation.navigate("SearchScreen");
      }
    } else if (apiResponse.isLoading || apiResponse.isFetching) {
      setShowModal(false);
      setApiAction(POSAPIHelper.isLoading);
    } else if (apiResponse.isError) {
      if (apiResponse.error instanceof APIError) {
        setErrmsg(apiResponse.error.message);
      } else {
        setErrmsg("SOMETHING WENT WRONG");
      }
      setApiAction(POSAPIHelper.isError);
      setShowModal(true);
    } else {
      console.log(apiResponse.status);
    }
  };
  const toggleConfirmBtn = () => {
    if (rows[4].selectedData != undefined) {
      return false;
    } else {
      return true;
    }
  };
  const selectBtnClicked = () => {};

  const renderCell = (cell: ListRenderItemInfo<InventoryList>) => {
    let btnText = cell.item.selectedData === undefined ? "Select" : "Modify";
    let selectionText = "";
    switch (cell.item.id) {
      case InventorySaleScreen.Entry:
        selectionText = `Mode: ${cell.item.selectedData?.name || ""}`;
        break;
      case InventorySaleScreen.Type:
        selectionText = `Type: ${cell.item.selectedData?.name || ""}`;
        break;
      case InventorySaleScreen.Source:
        selectionText = `Source: ${cell.item.selectedData?.name || ""}`;
        break;
      case InventorySaleScreen.Target:
        selectionText = `Target: ${cell.item.selectedData?.name || ""}`;
        break;
      case InventorySaleScreen.Product:
        selectionText = `Product: ${cell.item.selectedData?.name || ""}`;
        break;
      default:
        console.log("Do nothing");
        break;
    }
    return (
      <SelectedModCell
        rightViewType={"button"}
        text={selectionText}
        buttonTitle={btnText}
        id={cell.item.id}
        modifyCallback={(id) => {
          /// Fire API and laucnh Search screen
          prepareDataForSearch(cell.item.id);
        }}
      />
    );
  };
  return (
    <View style={styles.containerView}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        renderItem={(item) => renderCell(item)}
      />
      <View style={styles.btnView}>
        <OoredooPayBtn
          isDisabled={toggleConfirmBtn()}
          onPress={() => selectBtnClicked()}
          title={"Next"}
        />
      </View>
      {apiAction === POSAPIHelper.isError ? (
        <OoredooBadReqView
          modalVisible={showModal}
          action={() => setShowModal(false)}
          title={errorMSg}
        />
      ) : null}
    </View>
  );
};

export default InventorySaleRepacked;

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    flexGrow: 1,
  },
  btnView: {
    marginVertical: 16,
    marginHorizontal: 6,
  },
});
export interface InventoryList {
  id: InventorySaleScreen;
  selectedData?: POSSelectData;
}
type InventorySaleProps = NativeStackScreenProps<
  RootStackParamList,
  "InventorySale"
>;
