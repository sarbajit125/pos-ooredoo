import { ListRenderItemInfo, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
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
  const [apiRequest, setapiRequest] = useState<string>("");
  const [selectedType, setSelectedType] = useState<POSSelectData | undefined>(undefined);
  const [selectedSource, setSelectedSource] = useState<POSSelectData | undefined>(undefined);
  const [errorMSg, setErrmsg] = useState<string>("");
  const [selectionHeadingLbl, setHeadingLbl] = useState<string>("Select mode");
  const apiResponse = FetchInventoryRules(pageName, apiRequest);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    props.navigation.setOptions({ title: "Inventory Sale" });
    if (pageName === InventorySaleScreen.Entry) {
     console.log("Don't fire API ")
    } else {
      apiResponse.refetch();
      handleAPIResponse();
    }
  }, [pageName, apiResponse.data]);
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
        setShowModal(true);
        setApiAction(POSAPIHelper.isError);
      } else {
        setApiAction(POSAPIHelper.None);
        setShowModal(false);
        const tableData: POSSelectData[] = apiResponse.data.map((item) => ({
          id: item.value,
          name: item.text,
          isSelected: false,
        }));
        setList(tableData);
      }
    } else if (apiResponse.isLoading || apiResponse.isFetching) {
      setShowModal(false);
      setApiAction(POSAPIHelper.isLoading);
    } else {
      setList([]);
      setShowModal(true);
      if (apiResponse.error instanceof APIError) {
        setErrmsg(apiResponse.error.message);
      } else {
        setErrmsg("SOMETHING WENT WRONG");
      }
      setApiAction(POSAPIHelper.isError);
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
      case InventorySaleScreen.Source:
        setSelectedSource(selectedObj)
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
        cards = [
          {
            id: InventorySaleScreen.Type,
            name: `Selected Mode: ${selectedMode || ""}`,
            isSelected: false,
          },
        ];
        setCards(cards);
        setHeadingLbl("Select type");
        setFromDropDown("Select from dropdown");
        setapiRequest(selectedMode || "");
        setPage(InventorySaleScreen.Type);
        break;
      case InventorySaleScreen.Type:
        cards = [
          {
            id: InventorySaleScreen.Type,
            name: `Selected Mode: ${selectedMode || ""}`,
            isSelected: false,
          },
          {
            id: InventorySaleScreen.Source,
            name: `Selected Type: ${selectedType?.name || ""}`,
            isSelected: false,
          },
        ];
        setCards(cards);
        setHeadingLbl("Select source");
        setFromDropDown("Select from dropdown");
        setapiRequest(`${selectedMode || ""}/${selectedType?.id || ""}`);
        setPage(InventorySaleScreen.Source);
        break;
    case InventorySaleScreen.Source:
      cards = [
        {
          id: InventorySaleScreen.Type,
          name: `Selected Mode: ${selectedMode || ""}`,
          isSelected: false,
        },
        {
          id: InventorySaleScreen.Source,
          name: `Selected Type: ${selectedType?.name || ""}`,
          isSelected: false,
        },
        {
          id: InventorySaleScreen.Target,
          name: `Slected Source: ${selectedSource?.name || ""}`,
          isSelected: false
        }
      ];
      setCards(cards);
      setHeadingLbl("Select target");
      setFromDropDown("Select from dropdown");
      setapiRequest(`${selectedMode || ""}/${selectedType?.id || ""}/${selectedSource?.id || ""}`);
      setPage(InventorySaleScreen.Target);
      break;
      default:
        break;
    }
  };
  const modifyBtnTapped = (id: string) => {
    let cards: POSSelectData[] = [];
    switch (id) {
      case InventorySaleScreen.Entry:
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
        setapiRequest(selectedMode || "")
        setPage(InventorySaleScreen.Type);
        break
      default:
        break;
    }
    toggleConfirmBtn()
  };
  const toggleConfirmBtn = (): boolean => {
    switch (pageName) {
      case InventorySaleScreen.Entry:
        return selectedMode === undefined ? true : false;
      case InventorySaleScreen.Type:
        return selectedType === undefined ? true : false;
      case InventorySaleScreen.Source:
        return selectedSource === undefined ? true : false;
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
        heading={""}
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
    marginHorizontal: 10,
    marginTop: 10,
  },
  dropDownView: {
    height: 300,
  },
  cardViews: {
    flex: 1,
    flexDirection: "column",
    flexGrow: 1,
  },
  mainView: {
    flex: 1,
    flexGrow: 1,
  },
  cardList: {
   
  },
  textfieldView: {
    height: 70,
  },
});
type InventorySaleProps = NativeStackScreenProps<
  RootStackParamList,
  "InventorySale"
>;
