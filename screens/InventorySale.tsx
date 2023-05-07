import { ListRenderItemInfo, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  InventorySaleScreen,
  POSAPIHelper,
  POSSelectData,
  RootStackParamList,
} from "../types";
import OoredooPayBtn from "../components/OoredooPayBtn";
import { FlatList } from "react-native-gesture-handler";
import OoredooSelectionCell from "../components/Core/OoredooSelectionCell";
import SelectedModCell from "../components/Core/SelectedModCell";
import { FetchInventoryRules } from "../query-hooks/QueryHooks";
import OoredooActivityView from "../components/OoredooActivityView";
import OoredooBadReqView from "../components/errors/OoredooBadReqView";
import { APIError } from "../responseModels/responseModels";
const InventorySale = (props: InventorySaleProps) => {
  const [pageName, setPage] = useState<InventorySaleScreen>(
    InventorySaleScreen.Entry
  );
  const [dropdownList, setList] = useState<POSSelectData[]>([
    { id: "P", name: "Push", isSelected: false },
    { id: "R", name: "Request", isSelected: false },
  ]);
  const [cards, setCards] = useState<POSSelectData[]>([]);
  const [apiAction, setApiAction] = useState<POSAPIHelper>(POSAPIHelper.None);
  const [selectedFromDropdown, setFromDropDown] = useState<string>(
    "Select from dropdown"
  );
  const [selectedMode, setSelectedMode] = useState<string | undefined>(
    undefined
  );
  const [requestParams, setRequestParams] = useState<string>("");
  const [selectedType, setSelectedType] = useState<POSSelectData | undefined>(
    undefined
  );
  const [selectedSource, setSelectedSource] = useState<
    POSSelectData | undefined
  >(undefined);
  const [selectedTarget, setSelectedTarget] = useState<
    POSSelectData | undefined
  >(undefined);
  const [selectedProduct, setSelectedProduct] = useState<
    POSSelectData | undefined
  >(undefined);
  const [errorMSg, setErrmsg] = useState<string>("");
  const [selectionHeadingLbl, setHeadingLbl] = useState<string>("Select mode");
  let apiResponse = FetchInventoryRules(pageName, requestParams);
  const [showModal, setShowModal] = useState<boolean>(false);
  const requestRef = useRef<string>();
  useEffect(() => {
    props.navigation.setOptions({ title: "Inventory Sale" });
    if (pageName === InventorySaleScreen.Entry) {
      console.log("Don't fire API ");
    } else {
      if (
        apiResponse.isSuccess ||
        apiResponse.isError ||
        apiResponse.isLoading
      ) {
        handleAPIResponse();
      } else {
        apiResponse.refetch();
      }
    }
  }, [
    pageName,
    apiResponse.isSuccess,
    apiResponse.isLoading,
    apiResponse.isError,
  ]);
  const setButtonTitle = (): string => {
    switch (pageName) {
      case InventorySaleScreen.Validate:
        return "Validate";
      default:
        return "Next";
    }
  };
  const handleAPIResponse = () => {
    if (apiResponse.isSuccess) {
      if (apiResponse.data.length == 0) {
        setList([]);
        setErrmsg("NO DATA FOUND");
        setApiAction(POSAPIHelper.isError);
        setShowModal(true);
      } else {
        setApiAction(POSAPIHelper.None);
        setShowModal(false);
        setList(apiResponse.data);
      }
    } else if (apiResponse.isLoading || apiResponse.isFetching) {
      setShowModal(false);
      setApiAction(POSAPIHelper.isLoading);
    } else if (apiResponse.isError) {
      setList([]);
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
  const tickCheckBox = (selectedObj: POSSelectData) => {
    setFromDropDown(selectedObj.name);
    setList((prevState) =>
      prevState.map((item) =>
        item.id == selectedObj.id
          ? { ...item, isSelected: !item.isSelected }
          : { ...item, isSelected: false }
      )
    );
    setData(selectedObj);
  };
  const setData = (selectedObj: POSSelectData) => {
    switch (pageName) {
      case InventorySaleScreen.Entry:
        setSelectedMode(selectedObj.id);
        break;
      case InventorySaleScreen.Type:
        setSelectedType(selectedObj);
        break;
      case InventorySaleScreen.Source:
        setSelectedSource(selectedObj);
        break;
      case InventorySaleScreen.Target:
        setSelectedTarget(selectedObj)
        break
      case InventorySaleScreen.Product:
        setSelectedProduct(selectedObj)
        break
      default:
        break;
    }
  };
  const renderCell = (cell: ListRenderItemInfo<POSSelectData>) => {
    return (
      <OoredooSelectionCell
        data={cell.item}
        selectionCallback={(item) => tickCheckBox(item)}
      />
    );
  };
  const nextBtnClicked = () => {
    let cards: POSSelectData[] = [];
    switch (pageName) {
      case InventorySaleScreen.Entry:
        setTypePage();
        break;
      case InventorySaleScreen.Type:
        setSourcePage();
        break;
      case InventorySaleScreen.Source:
        setTargetPage();
        break;
      case InventorySaleScreen.Product:
        setProductPage()
        break
      default:
        break;
    }
  };
  const setEntryPage = () => {
    setPage(InventorySaleScreen.Entry);
    setHeadingLbl("Select mode");
    setFromDropDown("Select from dropdown");
    setCards([]);
    setList([
      { id: "P", name: "Push", isSelected: false },
      { id: "R", name: "Request", isSelected: false },
    ]);
  };
  const setTypePage = () => {
    let cards: POSSelectData[] = [];
    cards = [
      {
        id: InventorySaleScreen.Entry,
        name: `Selected Mode: ${selectedMode || ""}`,
        isSelected: false,
      },
    ];
    setRequestParams(selectedMode || "");
    requestRef.current = selectedMode;
    setCards(cards);
    setHeadingLbl("Select type");
    setFromDropDown("Select from dropdown");
    setPage(InventorySaleScreen.Type);
  };
  const setSourcePage = () => {
    let cards: POSSelectData[] = [
      {
        id: InventorySaleScreen.Entry,
        name: `Selected Mode: ${selectedMode || ""}`,
        isSelected: false,
      },
      {
        id: InventorySaleScreen.Type,
        name: `Selected Type: ${selectedType?.name || ""}`,
        isSelected: false,
      },
    ];
    setCards(cards);
    setHeadingLbl("Select source");
    setFromDropDown("Select from dropdown");
    setRequestParams(`${selectedMode || ""}/${selectedType?.id || ""}`);
    setPage(InventorySaleScreen.Source);
  };
  const setTargetPage = () => {
    let cards: POSSelectData[] = [
      {
        id: InventorySaleScreen.Entry,
        name: `Selected Mode: ${selectedMode || ""}`,
        isSelected: false,
      },
      {
        id: InventorySaleScreen.Type,
        name: `Selected Type: ${selectedType?.name || ""}`,
        isSelected: false,
      },
      {
        id: InventorySaleScreen.Source,
        name: `Selected Source: ${selectedSource?.name || ""}`,
        isSelected: false,
      },
    ];
    setCards(cards);
    setHeadingLbl("Select target");
    setFromDropDown("Select from dropdown");
    setRequestParams(
      `${selectedMode || ""}/${selectedType?.id || ""}/${
        selectedSource?.id || ""
      }`
    );
    setPage(InventorySaleScreen.Target);
  };
  const setProductPage = () => {
    let cards: POSSelectData[] = [
      {
        id: InventorySaleScreen.Entry,
        name: `Selected Mode: ${selectedMode || ""}`,
        isSelected: false,
      },
      {
        id: InventorySaleScreen.Type,
        name: `Selected Type: ${selectedType?.name || ""}`,
        isSelected: false,
      },
      {
        id: InventorySaleScreen.Source,
        name: `Selected Source: ${selectedSource?.name || ""}`,
        isSelected: false,
      },
      {
        id: InventorySaleScreen.Target,
        name: `Selected Target: ${selectedTarget?.name || ""}`,
        isSelected: false,
      },
    ];
    setCards(cards);
    setHeadingLbl("Select Product");
    setFromDropDown("Select from dropdown");
    setRequestParams(
      `${selectedMode || ""}/${selectedType?.id || ""}/${
        selectedSource?.id || ""
      }/${selectedTarget?.id || ""}`
    );
    setPage(InventorySaleScreen.Target);
  }
  const modifyBtnTapped = (id: string) => {
    let cards: POSSelectData[] = [];
    switch (id) {
      case InventorySaleScreen.Entry:
        setEntryPage();
        break;
      case InventorySaleScreen.Type:
        setHeadingLbl("Select mode");
        setFromDropDown("Select from dropdown");
        setCards([]);
        setList([
          { id: "P", name: "Push", isSelected: false },
          { id: "R", name: "Request", isSelected: false },
        ]);
        setPage(InventorySaleScreen.Entry);
      case InventorySaleScreen.Source:
        setHeadingLbl("Select type");
        setFromDropDown("Select from dropdown");
        cards = [
          {
            id: InventorySaleScreen.Type,
            name: `Selected Mode: ${selectedMode || ""}`,
            isSelected: false,
          },
        ];
        setCards(cards);
        setRequestParams(selectedMode || "");
        setPage(InventorySaleScreen.Type);
        break;
      default:
        break;
    }
    toggleConfirmBtn();
  };
  const toggleConfirmBtn = (): boolean => {
    switch (pageName) {
      case InventorySaleScreen.Entry:
        return selectedMode === undefined ? true : false;
        break;
      case InventorySaleScreen.Type:
        return selectedType === undefined ? true : false;
        break;
      case InventorySaleScreen.Source:
        return selectedSource === undefined ? true : false;
        break;
      case InventorySaleScreen.Target:
        return selectedTarget === undefined ? true : false;
        break;
      case InventorySaleScreen.Product:
        return selectedProduct === undefined ? true : false;
        break;
      default:
        return true;
    }
  };
  const renderSelectedRows = (cell: ListRenderItemInfo<POSSelectData>) => {
    return (
      <SelectedModCell
        rightViewType={"button"}
        text={cell.item.name}
        id={cell.item.id}
        modifyCallback={(id) => modifyBtnTapped(id)}
      />
    );
  };
  return (
      <View style={styles.containerView}>
        <View style={styles.mainView}>
          <View style={styles.cardViews}>
            {cards.length == 0 ? null : (
              <View style={styles.cardList}>
                <FlatList
                  data={cards}
                  keyExtractor={(item) => item.id}
                  renderItem={(item) => renderSelectedRows(item)}
                />
              </View>
            )}
            <View style={styles.textfieldView}>
              <SelectedModCell
                rightViewType={"none"}
                text={selectedFromDropdown}
                id={"tf"}
                modifyCallback={(id) => console.log(id)}
                heading={selectionHeadingLbl}
              />
            </View>
          </View>
          <View style={styles.dropDownView}>
            <FlatList
              data={dropdownList}
              keyExtractor={(item) => item.id}
              renderItem={(item) => renderCell(item)}
            />
          </View>
        </View>
        <View style={styles.buttonView}>
          <OoredooPayBtn
            isDisabled={toggleConfirmBtn()}
            onPress={() => nextBtnClicked()}
            title={setButtonTitle()}
          />
        </View>
        {apiAction === POSAPIHelper.isLoading ? (
          <View>
            <OoredooActivityView />
          </View>
        ) : apiAction === POSAPIHelper.isError ? (
          <View>
            <OoredooBadReqView
              modalVisible={showModal}
              action={function (): void {
                setShowModal(false);
              }}
              title={errorMSg}
            />
          </View>
        ) : null}
      </View>
  );
};

export default InventorySale;

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    flexGrow: 1,
  },
  buttonView: {
    bottom: 5,
    marginVertical: 10,
    marginHorizontal: 6,
  },
  dropDownView: {
    marginTop: 15,
    height: 300,
  },
  cardViews: {
    flex: 1,
    flexGrow: 1,
  },
  mainView: {
    flex: 1,
    flexGrow: 1,
  },
  cardList: {},
  textfieldView: {
    height: 70,
  },
});
type InventorySaleProps = NativeStackScreenProps<
  RootStackParamList,
  "InventorySale"
>;
