import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { APIManager } from "../../AppManger/ApiManger";
import { StoresContext } from "../../store/RootStore";
import dayjs from "dayjs";
import { ColorConstants } from "../../constants/Colors";
const DashboardKPI = observer(() => {
  const userStore = useContext(StoresContext).userDetailStore;
  const [kpiList, setKPIList] = useState<kpiScroll[]>([]);
  useEffect(() => {
    let yesterDay = new Date().getDate() - 1;
    const formatDate = dayjs(yesterDay).format("YYYY-MM_DD").toString();
    var scrollArr: kpiScroll[] = [
      { type: "Gross Add", value: "0", isSelcted: true },
      { type: "Primary", value: "0", isSelcted: false },
      { type: "Secondary", value: "0", isSelcted: false },
    ];
    APIManager.sharedInstance()
      .fetchDashboardGraph(formatDate, userStore.userId)
      .then((response) => {
        const lastObjinArr = response.responseBody.slice(-1).pop();
        lastObjinArr?.map((item) => {
          if (item.kpi === scrollArr[0].type) {
            scrollArr[0].value = item.mtd;
          } else if (item.kpi === scrollArr[1].type) {
            scrollArr[1].value = item.mtd;
          } else if (item.kpi === scrollArr[2].type) {
            scrollArr[2].value = item.mtd;
          }
        });
        setKPIList(scrollArr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const renderCollectionCell = (item: ListRenderItemInfo<kpiScroll>) => {
    return (
      <TouchableOpacity style={[
        styles.cell,
        item.item.isSelcted ? styles.selected : styles.notselected,
      ]}>
        <View
          style={[
            styles.cell,
            item.item.isSelcted ? styles.selected : styles.notselected,
          ]}
        >
          <Text
            style={item.item.isSelcted ? styles.selectedText : styles.cellText}
          >{`${item.item.type} (${item.item.value})`}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.scrollView}>
        <FlatList
          data={kpiList}
          horizontal={true}
          keyExtractor={(key) => key.type}
          renderItem={(item) => renderCollectionCell(item)}
        />
      </View>
      <View style={styles.graphview}></View>
    </View>
  );
});

export default DashboardKPI;

const styles = StyleSheet.create({
  container: {},
  scrollView: {
    height: 40,

  },
  graphview: {},
  cell: {
    width: 150,
    height:35,
    borderRadius: 50,
    marginLeft: 15,
    marginRight:15,
    padding: 5,
    justifyContent: 'center',
    alignContent:"center",
  },
  selected: {
    backgroundColor: ColorConstants.red_ED1
  },
  notselected: {
    backgroundColor: ColorConstants.white
  },
  cellText: {
    color: ColorConstants.black,
    font:'Rubik_700Bold',
    fontSize: 14
  },
  selectedText:{
    color: ColorConstants.white,
    font:'Rubik_700Bold',
    fontSize: 14
  }
});

interface kpiScroll {
  type: string;
  value: string;
  isSelcted: boolean;
}
