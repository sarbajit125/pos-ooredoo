import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { View, Image, TouchableHighlight } from "react-native";
import NavigationBar from "../components/Core/NavigationBar";
import { ColorConstants } from "../constants/Colors";
import Dashboard from "../screens/Dashboard";

import Login from "../screens/Login";
import Rewards from "../screens/Rewards";
import Support from "../screens/Support";
import ViewStock from "../screens/ViewStock";
import { RootStackParamList, RootTabParamList } from "../types";

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator   screenOptions={{
      headerBackVisible:false,
      header(props) {
        return (<NavigationBar {...props}  />)
      },
    }}>
      <Stack.Screen
        name="Root"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen name= "StockStatus" component={ViewStock}  />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function Home() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ColorConstants.red_ED1,
        tabBarInactiveTintColor: ColorConstants.grey_898,
        tabBarStyle:{
          marginBottom: 20,
          height: 80,
          borderRadius: 8,
          borderWidth: 1,
          shadowColor: ColorConstants.shadow_color,
          backgroundColor: ColorConstants.white,
          shadowOffset: {width: -2, height: 4},
          shadowRadius: 2,
          shadowOpacity: 0,
        },
        tabBarLabelStyle:{
          paddingBottom: 10,
        }
      }}
    >
      <BottomTab.Screen name="Home" component={Dashboard} options={{tabBarIcon(props) {
        return (
          <View>
            <Image source={require("../assets/images/homeTab.png")}
              resizeMode="contain"
              style={{ width: 25, maxHeight: 25 }}/>
          </View>
        )
      },}} />
      <BottomTab.Screen name="Rewards" component={Rewards} options={{tabBarIcon(props) {
        return (
          <View>
            <Image source={require("../assets/images/rewardTab.png")}
              resizeMode="contain"
              style={{ width: 25, maxHeight: 25 }}/>
          </View>
        )
      },}} />
      <BottomTab.Screen name="Support" component={Support} options={{tabBarIcon(props) {
        return (
          <View>
            <Image source={require("../assets/images/supportTab.png")}
              resizeMode="contain"
              style={{ width: 25, maxHeight: 25 }}/>
          </View>
        )
      },}} />
    </BottomTab.Navigator>
  );
}
