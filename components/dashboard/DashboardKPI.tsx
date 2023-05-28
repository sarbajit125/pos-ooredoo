import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ColorConstants } from "../../constants/Colors";
import {
  dashboardGraphHook,
  fetchSelfDetails,
} from "../../query-hooks/QueryHooks";
import { LineChart } from "react-native-chart-kit";
import OoredooActivityView from "../OoredooActivityView";
import dayjs from "dayjs";
import { GraphData } from "../../types";
const DashboardKPI = () => {
  const detailsVM = fetchSelfDetails();
  const [kpiList, setKPIList] = useState<kpiScroll[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const { data, isSuccess, isLoading, refetch } = dashboardGraphHook(userId);

  useEffect(() => {
    detailsVM.isSuccess ? setUserId(detailsVM.data.userId) : null;
  }, [detailsVM.isSuccess]);

  useEffect(() => {
    refetch();
  }, [userId]);
  useEffect(() => {
    if (isSuccess) {
      let scrollArr: kpiScroll[] = [
        { type: "Gross Add", value: "0", isSelcted: true },
        { type: "Primary", value: "0", isSelcted: false },
        { type: "Secondary", value: "0", isSelcted: false },
      ];
      data.lastObj.map((item) => {
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
  }, [isSuccess]);
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
    const selectedTab = updatedArr.filter((item) => item.isSelcted)[0].type;
    switch (selectedTab) {
      case "Gross Add":
        setGraphData(data?.grossList ?? []);
        break;
      case "Primary":
        setGraphData(data?.primaryList ?? []);
        break;
      case "Secondary":
        setGraphData(data?.secondaryList ?? []);
        break;
      default:
        setGraphData(data?.grossList ?? []);
        break;
    }
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
  return (
    <View style={styles.container}>
      {isSuccess ? (
        <View>
          <View style={styles.scrollView}>
            <FlatList
              data={kpiList}
              horizontal={true}
              keyExtractor={(key) => key.type}
              renderItem={(item) => renderCollectionCell(item)}
            />
          </View>
          <View style={styles.graphview}>
            {graphData.length > 0 ? (
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
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                  },
                }}
                data={{
                  labels: graphData.map((item) =>
                    dayjs(item.date).format("DD MMM").toString()
                  ),
                  legend: ["Gross"],
                  datasets: [
                    {
                      data: graphData.map((item) =>
                        parseFloat(item.value)
                      ),
                      strokeWidth: 2,
                    },
                  ],
                }}
                style={{ borderRadius: 16 }}
              />
            ) : (
              <View>
                <Text> NO DATA</Text>
              </View>
            )}
          </View>
        </View>
      ) : null}
      {isLoading ? <OoredooActivityView /> : null}
    </View>
  );
};

export default DashboardKPI;

const styles = StyleSheet.create({
  container: {},
  scrollView: {
    height: 40,
  },
  graphview: {
    marginTop: 10,
    padding: 2,
  },
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
