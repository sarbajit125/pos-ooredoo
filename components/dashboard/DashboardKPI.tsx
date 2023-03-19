import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { StoresContext } from "../../store/RootStore";
import { ColorConstants } from "../../constants/Colors";
import { dashboardGraphHook } from "../../query-hooks/QueryHooks";
import { LineChart } from "react-native-chart-kit";
const DashboardKPI = observer(() => {
  const userStore = useContext(StoresContext).userDetailStore;
  const [kpiList, setKPIList] = useState<kpiScroll[]>([]);
  var [grossList, setGrossList] = useState<GraphData[]>([]);
  var [primaryList, setPrimaryList] = useState<GraphData[]>([]);
  var [secondaryList, setSecondaryList] = useState<GraphData[]>([]);
  const { data, isSuccess, isLoading, error } = dashboardGraphHook(
    userStore.userId
  );
  useEffect(() => {
    if (isSuccess) {
      const lastObj = data.responseBody.slice(-1).pop();
      let scrollArr: kpiScroll[] = [
        { type: "Gross Add", value: "0", isSelcted: true },
        { type: "Primary", value: "0", isSelcted: false },
        { type: "Secondary", value: "0", isSelcted: false },
      ];
      lastObj?.map((item) => {
        if (item.kpiType === scrollArr[0].type) {
          scrollArr[0].value = item.mtd;
        }
        if (item.kpiType === scrollArr[1].type) {
          scrollArr[1].value = item.mtd;
        }
        if (item.kpiType === scrollArr[2].type) {
          scrollArr[2].value = item.mtd;
        }
      });
      setKPIList(scrollArr);
    }
  }, [data]);
  const cellSelected = (cell: kpiScroll) => {
    const updatedArr = kpiList.map((item) => {
      let obj: kpiScroll = {
        isSelcted: item.type === cell.type ? true : false,
        type: item.type,
        value: item.value,
      };
      return obj;
    });
    setKPIList(updatedArr);
  };
  const renderCollectionCell = (item: ListRenderItemInfo<kpiScroll>) => {
    return (
      <TouchableOpacity
        style={[
          styles.cell,
          item.item.isSelcted ? styles.selected : styles.notselected,
        ]}
        activeOpacity={0.8}
        onPress={() => cellSelected(item.item)}
      >
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
  const rendergraph = () => {
    let grossArr: GraphData[] = [];
    data?.responseBody.map((item) => {
      item.filter((item) => item.kpiType === "Gross Add").forEach((item) => {
        let graphObj: GraphData = { date: item.addDate, value: item.mtd };
            grossArr.push(graphObj);
      })
      // setGrossList(grossArr);
      // let primaryArr: GraphData[] = [];
      // item.filter((item) => item.kpiType === scrollArr[1].type).forEach((item) => {
      //   let graphObj: GraphData = { date: item.addDate, value: item.mtd };
      //   primaryArr.push(graphObj);
      // })
      // setPrimaryList(primaryArr);
      // let secondaryArr: GraphData[] = [];
      // item.filter((item) => item.kpiType === scrollArr[2].type).forEach((item) => {
      //   let graphObj: GraphData = { date: item.addDate, value: item.mtd };
      //   secondaryArr.push(graphObj);
      // })
      // setSecondaryList(secondaryArr);
    });
    return (
      <LineChart
          width={Dimensions.get("window").width - 16}
          height={200}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "white",
            backgroundGradientTo: "white",        
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(176, 224, 32, 1)`,
            labelColor: (opacity = 1) => `rgba(137, 137, 137, 1)`,

            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              
            }
          }}
          data={{
            labels: ["!","2"],
            legend: ['Gross'],
            datasets:[
              {
                data: [1,2,3],
                strokeWidth: 2,
              },
            ],
          }}
          style={{borderRadius: 16}}
        />
    )
  }
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
      <View style={styles.graphview}>
        {isSuccess ? rendergraph() : null }
      </View>
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
    height: 35,
    borderRadius: 50,
    marginLeft: 15,
    marginRight: 15,
    padding: 5,
    justifyContent: "center",
    alignContent: "center",
  },
  selected: {
    backgroundColor: ColorConstants.red_ED1,
  },
  notselected: {
    backgroundColor: ColorConstants.white,
  },
  cellText: {
    color: ColorConstants.black,
    font: "Rubik_700Bold",
    fontSize: 14,
  },
  selectedText: {
    color: ColorConstants.white,
    font: "Rubik_700Bold",
    fontSize: 14,
  },
});

interface kpiScroll {
  type: string;
  value: string;
  isSelcted: boolean;
}

interface GraphData {
  date: string;
  value: string;
}
