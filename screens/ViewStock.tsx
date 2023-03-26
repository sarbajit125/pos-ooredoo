import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
  Image,
  Text
} from "react-native";
import React, { useContext } from "react";
import { StockDetailsHook } from "../query-hooks/QueryHooks";
import { StoresContext } from "../store/RootStore";
import { observer } from "mobx-react";
import { StockStatusBody } from "../responseModels/StockStatusResponse";
import OoredooBadReqView from "../components/errors/OoredooBadReqView";
import OoredooActivityView from "../components/OoredooActivityView";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { ColorConstants } from "../constants/Colors";
import { Fontcache } from "../constants/FontCache";

const ViewStock = observer((props: ViewStockNavProps) => {
  const userStore = useContext(StoresContext).userDetailStore;
  const { data, isSuccess, isLoading } = StockDetailsHook(userStore.userId);
  const renderTableCell = (cell: ListRenderItemInfo<StockStatusBody>) => {
    return <View style={styles.cell}>
        <View style={styles.imageView} >
        <Image style={styles.imageView} source={require('../assets/images/sim_cardsim.png')}/>
        </View>
        <View style={styles.textView}>
            <Text style={styles.heading}>
                {cell.item.currentStock}
            </Text >
            <Text style={styles.desc}>
                {cell.item.itemCode}
            </Text>
        </View>
    </View>;
  };
  if (isSuccess) {
    return (
      <View  style={styles.container}>
        <FlatList
          data={data.responseBody}
          keyExtractor={(item) => item.itemCode || "12"}
          renderItem={(item) => renderTableCell(item)}
        />
      </View>
    );
  } else if (isLoading) {
    return (
      <View>
        <OoredooActivityView />
      </View>
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
    height: 80,
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
    justifyContent: 'space-evenly'
  },
  heading:{
    fontFamily: Fontcache.rubikRegular,
    fontSize: 24,
    paddingTop: 16,
    paddingLeft: 8,
  },
  desc :{
    fontFamily: Fontcache.notoRegular,
    fontSize: 12,
    paddingLeft: 8,
    paddingBottom: 2,
  }
});
type ViewStockNavProps = NativeStackScreenProps<RootStackParamList, 'StockStatus'>
