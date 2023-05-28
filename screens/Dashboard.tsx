import { StyleSheet, View, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, RootTabParamList } from "../types";
import DashbordNav from "../components/dashboard/DashbordNav";
import DashboardGreeting from "../components/dashboard/DashboardGreeting";
import DashboardBalance from "../components/dashboard/DashboardBalance";
import DashboardKPI from "../components/dashboard/DashboardKPI";
import OoredooBadReqView from "../components/errors/OoredooBadReqView";
import DashboardServices from "../components/dashboard/DashboardServices";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import OoredooActivityView from "../components/OoredooActivityView";
import { fetchSelfDetails } from "../query-hooks/QueryHooks";
import { POSUserDataContext } from "../store/RootStore";
type LoginScreenProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;
const Dashboard = (props: LoginScreenProps) => {
  const {setUserDetails} = POSUserDataContext()
  const { data, isSuccess, isError, isLoading } = fetchSelfDetails()
  useEffect (() => {
  isSuccess ? setUserDetails(data) : null
  },[isSuccess])
  return (
    <ScrollView>
      {isSuccess ? <View style={styles.container}>
          <View style={styles.topBar}>
            <DashbordNav
              profileTapped={function (): void {
                props.navigation.navigate('Profile')
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
                props.navigation.navigate('StockStatus')
              }}
            />
          </View>
          <View style={styles.kpiView}>
            <DashboardKPI />
          </View>
          <View style={styles.servicesView}>
            <DashboardServices />
          </View>
        </View> : null}
      {isLoading? <OoredooActivityView /> : null}
      {isError ?  <OoredooBadReqView
          modalVisible={true}
          action={() => props.navigation.goBack()}
          title={"API error"}
        /> : null}
    </ScrollView>
  )
};

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
    height: 300,
  },
  servicesView: {
    height: 500,
  },
});
