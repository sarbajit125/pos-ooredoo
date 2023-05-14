import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { POSSelectData, RootStackParamList } from "../types";
import OoredooPayBtn from "../components/OoredooPayBtn";
import OoredooTextInput from "../components/OoredooTextInput";
import OoredooSelectionCell from "../components/Core/OoredooSelectionCell";
import { SearchScreenContext } from "../store/RootStore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header13RubikLbl from "../components/OoredooFonts/Rubik/Header13RubikLbl";

const SearchScreen = (props: SearchNavProps) => {
  const [table, setTable] = useState<POSSelectData[]>([]);
  const [searchingRows, setSearchingRows] = useState<POSSelectData[]>([]);
  const [searchText, setSearchText] = useState<string>();
  const { data, setData, setSelectedData, serviceCode } = SearchScreenContext();
  const [isSearching, setSearching] = useState<boolean>(false)
  const toggleConfirmBtn = (): boolean => {
    const filteredRows = table.filter((item) => item.isSelected === true);
    if (filteredRows.length > 0) {
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
    setTable(data);
  }, []);
  const selectBtnClicked = () => {
    setSelectedData(
      {
        selectedData:table.filter((item) => item.isSelected),
        serviceCode: serviceCode
      }
    )
    props.navigation.goBack();
  };
  const tickCheckBox = (selectedObj: POSSelectData) => {
    setTable((prevState) =>
      prevState.map((item) =>
        item.id == selectedObj.id
          ? { ...item, isSelected: !item.isSelected }
          : { ...item, isSelected: false }
      )
    );
    setSearchingRows((prevState) =>
      prevState.map((item) =>
        item.id == selectedObj.id
          ? { ...item, isSelected: !item.isSelected }
          : { ...item, isSelected: false }
      )
    );
    toggleConfirmBtn();
  };

  const renderCell = (cell: ListRenderItemInfo<POSSelectData>) => {
    return (
      <OoredooSelectionCell
        data={cell.item}
        selectionCallback={(item) => tickCheckBox(item)}
      />
    );
  };
  const filterAction = (searchText: string) => {
    setSearchText(searchText)
    if  (searchText.length === 0) {
      setSearching(false)
    } else {
      setSearching(true)
      const searchedRows = table.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
      setSearchingRows(searchedRows)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <View style={styles.textfieldView}>
          <Header13RubikLbl>Select from dropdown</Header13RubikLbl>
          <OoredooTextInput
            style={styles.textfield}
            showError={undefined}
            errorMsg="Invalid Search"
            placeholder="Search here"
            value={searchText}
            onChangeText={(text) => filterAction(text)}
          />
        </View>
        <View style={styles.tableView}>
          <FlatList data={isSearching ? searchingRows : table} renderItem={(item) => renderCell(item)} />
        </View>
      </View>
      <View style={styles.btnView}>
        <OoredooPayBtn
          isDisabled={toggleConfirmBtn()}
          onPress={() => selectBtnClicked()}
          title={"Select"}
        />
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  mainView: {
    flexGrow: 1,
    justifyContent:'space-between',
  },
  textfieldView: {
    marginVertical: 16,
    marginHorizontal: 5,
    height: 80,
  },
  tableView: {
    marginTop: 40,
    height:300,
  },
  btnView: {
    marginVertical: 16,
    marginHorizontal: 6,
  },
  textfield:{
    marginVertical:8,
  }
});
export interface SearchScreenProps {
  data: POSSelectData[];
  selectedData?: SearchSelectedProps;
  setData: (data: POSSelectData[]) => void;
  setSelectedData: (data?: SearchSelectedProps) => void;
  serviceCode: string
  setServiceCode: (code: string) => void
}
type SearchNavProps = NativeStackScreenProps<
  RootStackParamList,
  "SearchScreen"
>;
export interface SearchSelectedProps {
  selectedData?:  POSSelectData[]
  serviceCode: string
}
