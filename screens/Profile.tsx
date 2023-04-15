import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { ColorConstants } from "../constants/Colors";
import { Fontcache } from "../constants/FontCache";
import { StoresContext } from "../store/RootStore";
import {
  ExpandableComponent,
  ExpandableListProps,
} from "../components/Profile/ExpandableListView";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
const Profile = (props: ProfileNavProps) => {
  const userStore = useContext(StoresContext).userDetailStore;
  const [serviceList, setServiceList] =
    useState<ExpandableListProps[]>(ProfileServiceData);
  // ref
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ["45%"], []);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const updateLayout = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...serviceList];
    // If single select is enabled
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]["isExpanded"] = !array[placeindex]["isExpanded"])
        : (array[placeindex]["isExpanded"] = false)
    );
    setServiceList(array);
  };
  const routerServices = (keyStr: string) => {
    switch (keyStr) {
      case "logout":
        bottomSheetRef.current?.present();
      case 'transactionHistory':
        props.navigation.navigate('TransactionHistory',{id:'transactionHistory'})
      default:
        console.log(keyStr);
    }
  };
  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.navView}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}
            style={styles.imageButton}
          >
            <Image
              style={{ width: 20, height: 15 }}
              source={require("../assets/images/backArrow.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../assets/images/bellNotification.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.nameView}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>{userStore.userDesc}</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          {serviceList.map((item, key) => {
            return (
              <ExpandableComponent
                item={item}
                key={key}
                onClick={(keyStr) => {
                  updateLayout(key);
                  routerServices(keyStr);
                }}
              />
            );
          })}
        </ScrollView>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={styles.sheets}>
            <Text>Awesome 🎉</Text>
          </View>
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navView: {
    marginTop: 20,
    marginHorizontal: 8,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 95,
    alignContent: "center",
    alignItems: "center",
  },
  imageButton: {
    padding: 10,
    width: 25,
    height: 25,
  },
  nameView: {
    height: 170,
    backgroundColor: ColorConstants.grey_898,
    opacity: 0.3,
  },
  username: {
    marginHorizontal: 8,
    fontFamily: Fontcache.notoLight,
    fontSize: 26,
    color: ColorConstants.black,
    padding: 5,
  },
  greeting: {
    marginHorizontal: 8,
    fontFamily: Fontcache.rubikBold,
    fontSize: 14,
    color: ColorConstants.black,
    padding: 5,
    marginTop: 20,
  },
  scrollView: {
    backgroundColor: ColorConstants.white,
  },
  sheets: {},
});

const ProfileServiceData: ExpandableListProps[] = [
  {
    isExpanded: false,
    category_name: "Profile details",
    key: "profileDetails",
    subcategory: [],
  },
  {
    category_name: "Transaction History",
    key: "transactionHistory",
    isExpanded: false,
    subcategory: [],
  },
  {
    isExpanded: false,
    category_name: "Up-gradation/Down-gradation",
    key: "postpaidService",
    subcategory: [
      {
        id: "prepaidUpgrade",
        val: "Prepaid to postpaid Up-gradation",
      },
      {
        id: "postpaidUpgrade",
        val: "Postpaid plan up-gradation",
      },
      {
        id: "postpaidDowngrade",
        val: "Postpaid plan down-gradation",
      },
    ],
  },
  {
    isExpanded: false,
    key: "walletService",
    category_name: "Wallets",
    subcategory: [
      {
        id: "walletToWallet",
        val: "Wallet to wallet transfer",
      },
      {
        id: "walletHistory",
        val: "Wallet transfer history",
      },
    ],
  },
  {
    isExpanded: false,
    key: "logout",
    category_name: "Logout",
    subcategory: [],
  },
];
type ProfileNavProps = NativeStackScreenProps<RootStackParamList, "Profile">;
