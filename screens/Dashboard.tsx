import { StyleSheet, View, ScrollView } from "react-native";
import React, { useContext } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, RootTabParamList } from "../types";
import DashbordNav from "../components/dashboard/DashbordNav";
import DashboardGreeting from "../components/dashboard/DashboardGreeting";
import DashboardBalance from "../components/dashboard/DashboardBalance";
import { observer } from "mobx-react";
import { StoresContext, UserDetailContext } from "../store/RootStore";
import DashboardKPI from "../components/dashboard/DashboardKPI";
import { useQuery } from "react-query";
import { APIManager } from "../AppManger/ApiManger";
import OoredooBadReqView from "../components/errors/OoredooBadReqView";
import DashboardServices from "../components/dashboard/DashboardServices";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
type LoginScreenProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;
const Dashboard = observer((props: LoginScreenProps) => {
  const userStore = useContext(StoresContext).userDetailStore;
  const {setUserDetails} = UserDetailContext()
  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["selfDetails"],
    queryFn: () => APIManager.sharedInstance().userDetails(),
  });
  if (isSuccess) {
    userStore.fetchSelfDetails(data);
    //setUserDetails(data)
    return (
      <ScrollView>
        <View style={styles.container}>
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
        </View>
      </ScrollView>
    );
  } else if (isLoading) {
    return (
      <View style={styles.container}>
        {/* <OoredooActivityView /> */}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <OoredooBadReqView
          modalVisible={true}
          action={() => props.navigation.goBack()}
          title={"API error"}
        />
      </View>
    );
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
    height: 300,
  },
  servicesView: {
    height: 500,
  },
});
