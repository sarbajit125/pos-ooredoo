import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
  Image,
  Text,
} from "react-native";
import React, { useContext, useState } from "react";
import { StockDetailsHook } from "../query-hooks/QueryHooks";
import { StoresContext } from "../store/RootStore";
import { observer } from "mobx-react";
import OoredooBadReqView from "../components/errors/OoredooBadReqView";
import OoredooActivityView from "../components/OoredooActivityView";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { ColorConstants } from "../constants/Colors";
import { Fontcache } from "../constants/FontCache";
import { StockStatusResponse } from "../responseModels/StockStatusResponse";

const ViewStock = observer((props: ViewStockNavProps) => {
  const userStore = useContext(StoresContext).userDetailStore;
  const { data, isSuccess, isLoading } = StockDetailsHook(userStore.userId);
  const renderTableCell = (cell: ListRenderItemInfo<StockStatusResponse>) => {
    return <View style={styles.cell}>
        <View style={styles.imageView} >
        <Image style={styles.imageView} source={require('../assets/images/sim_cardsim.png')}/>
        </View>
        <View style={styles.textView}>
            <Text style={styles.heading}>
                {cell.item.inventoryTypeDescription}
            </Text >
            <Text style={styles.desc}>
                {cell.item.sku}
            </Text>
            <Text style={styles.desc}>
                {`Quantity: ${cell.item.count}`}
            </Text>
        </View>
    </View>;
  };
  if (isSuccess) {
    return (
      <View  style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.sku || "12"}
          renderItem={(item) => renderTableCell(item)}
        />
      </View>
    );
  } else if (isLoading) {
    return (
      <OoredooActivityView />
    );
  } else {
    return (
      <View>
        <OoredooBadReqView
          modalVisible={true}
          action={() => props.navigation.goBack()}
          title={"API error"}
        />
      </View>
    );
  }
});
export default ViewStock;

const styles = StyleSheet.create({
  container: {},
  cell:{
    backgroundColor: ColorConstants.white,
    borderWidth: 2,
    borderColor: ColorConstants.grey_E0E,
    borderRadius: 5,
    marginHorizontal: 21,
    marginVertical: 12,
    flexDirection: 'row',
  },
  imageView:{
    width: 32,
    height: 50,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginRight: 10,
  },
  textView:{
    marginLeft:10,
    flexDirection: 'column',
    flexWrap:'wrap',
  },
  heading:{
    fontFamily: Fontcache.rubikRegular,
    fontSize: 18,
    paddingTop: 16,
    paddingLeft: 8,
    width: "80%"
  },
  desc :{
    fontFamily: Fontcache.notoRegular,
    fontSize: 12,
    paddingLeft: 8,
    paddingBottom: 2,
  }
});
type ViewStockNavProps = NativeStackScreenProps<RootStackParamList, 'StockStatus'>
