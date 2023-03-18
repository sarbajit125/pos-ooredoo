import { StyleSheet, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import DashbordNav from "../components/dashboard/DashbordNav";
import DashboardGreeting from "../components/dashboard/DashboardGreeting";
import DashboardBalance from "../components/dashboard/DashboardBalance";
import { observer } from "mobx-react";
import { StoresContext } from "../store/RootStore";
import DashboardKPI from "../components/dashboard/DashboardKPI";
import { useQuery } from "react-query";
import { APIManager } from "../AppManger/ApiManger";
import OoredooActivityView from "../components/OoredooActivityView";
import OoredooBadReqView from "../components/errors/OoredooBadReqView";
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Dashboard">;
const Dashboard = observer((props: LoginScreenProps) => {
  const userStore = useContext(StoresContext).userDetailStore;
  const {data, isSuccess, isError, isLoading} = useQuery({
    queryKey:['selfDetails'],
    queryFn: () => APIManager.sharedInstance().userDetails()
  })
   if (isSuccess) {
    userStore.fetchSelfDetails(data)
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <DashbordNav
            profileTapped={function (): void {
              // Laucnh Profile section
            }}
            notificationTapped={function (): void {
              // Launch notification
            }}
          />
        </View>
        <View style={styles.greetingView}>
          <DashboardGreeting />
        </View>
        <View style={styles.balanceView}>
          <DashboardBalance
            stockBalancePressed={function (): void {
              console.log("open stocks screen");
            }}
          />
        </View>
        <View style={styles.kpiView}>
          <DashboardKPI />
        </View>
        <View style={styles.servicesView}>
          <View style={styles.tabView}></View>
        </View>
      </View>
    );
   } else if (isLoading) {
    return (
      <View style={styles.container}>
        <OoredooActivityView />
      </View>
    )
   } else {
    return (
      <View style={styles.container}>
        <OoredooBadReqView modalVisible={true} action={ () => props.navigation.goBack()} title={"API error"} />
      </View>
    )
   }

});

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  topBar: {
    height: 80,
  },
  greetingView: {
    height: 80,
  },
  balanceView: {
    height: 160,
  },
  kpiView: {
    height: 380,
  },
  servicesView: {
    backgroundColor: "gold",
  },
  tabView: {
    backgroundColor: "pink",
    position: "absolute",
    width: "80%",
    bottom: 90,
    height: 60,
    alignSelf: "center",
  },
});
