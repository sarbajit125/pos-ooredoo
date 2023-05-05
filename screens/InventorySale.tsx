import {
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  InventorySaleScreen,
  POSSelectData,
  RootStackParamList,
} from "../types";
import OoredooPayBtn from "../components/OoredooPayBtn";
import { FlatList } from "react-native-gesture-handler";
import { Fontcache } from "../constants/FontCache";
import { ColorConstants } from "../constants/Colors";
import CellSepratorView from "../components/History/CellSepratorView";
import OoredooSelectionCell from "../components/Core/OoredooSelectionCell";
import SelectedModCell from "../components/Core/SelectedModCell";

const InventorySale = (props: InventorySaleProps) => {
  const [pageName, setPage] = useState<InventorySaleScreen>(
    InventorySaleScreen.Entry
  );
  const [dropdownList, setList] = useState<POSSelectData[]>([]);
  const [cards, setCards] = useState<POSSelectData[]>([]);
  const [selectedFromDropdown, setFromDropDown] = useState<string>('')

  useEffect(() => {
    switch (props.route.params.screeName) {
      case InventorySaleScreen.Entry:
        props.navigation.setOptions({ title: "Inventory sale" });
        setPage(InventorySaleScreen.Entry);
        setList([
          { id: "p", name: "Push", isSelected: false },
          { id: "r", name: "Request", isSelected: false },
        ]);
        break;
      default:
        props.navigation.setOptions({ title: "Inventory Sale" });
        break;
    }
  }, []);
  const setButtonTitle = (): string => {
    switch (pageName) {
      case InventorySaleScreen.Validate:
        return "Validate";
      default:
        return "Next";
    }
  };
  const tickCheckBox = (selectedObj: POSSelectData) => {
    setFromDropDown(selectedObj.name)
    setList((prevState) =>
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
  const renderSelectedRows = (cell: ListRenderItemInfo<POSSelectData>) => {
    return (
      <SelectedModCell
        rightViewType={"button"}
        text={cell.item.name}
        id={cell.item.id}
        modifyCallback={(id) => console.log(id)}
      />
    );
  };
  return (
    <View style={styles.containerView}>
      <View style={styles.mainView}>
        <View style={styles.cardViews}>
          {cards.length == 0 ? null : <View style={styles.cardList}>
            <FlatList
              data={cards}
              keyExtractor={(item) => item.id}
              renderItem={(item) => renderSelectedRows(item)}
            />
            <View style={styles.textfieldView}> 
              <SelectedModCell rightViewType={"none"} text={selectedFromDropdown} id={"tf"} modifyCallback={(id) => console.log(id)} />
            </View>
          </View>}
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
          onPress={function (): void {
            throw new Error("Function not implemented.");
          }}
          title={"Next"}
        />
      </View>
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
    backgroundColor:'purple',
  },
  cardViews: {
    flex: 1,
    flexDirection: 'column',
   flexGrow:1,
   backgroundColor:'yellow'
  },
  mainView: {
    flex: 1,
    flexGrow:1,
    flexDirection:'column-reverse'
  },
  cardList: {
    height: 100,
    backgroundColor: 'red'
  },
  textfieldView: {
    backgroundColor: 'red',
    height: 70,
  },
});
type InventorySaleProps = NativeStackScreenProps<
  RootStackParamList,
  "InventorySale"
>;
