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
  useMemo,
  useRef,
  useState,
} from "react";
import { ColorConstants } from "../constants/Colors";
import { Fontcache } from "../constants/FontCache";
import { POSUserDataContext, SearchScreenContext } from "../store/RootStore";
import {
  ExpandableComponent,
  ExpandableListProps,
} from "../components/Profile/ExpandableListView";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InventorySaleScreen, RootStackParamList } from "../types";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import OoredooPayBtn from "../components/OoredooPayBtn";
import { APIManager } from "../AppManger/ApiManger";
const Profile = (props: ProfileNavProps) => {
  const {setSelectedData} = SearchScreenContext()
  const {userDesc} =  POSUserDataContext()
  const [serviceList, setServiceList] =
    useState<ExpandableListProps[]>(ProfileServiceData);
  // ref
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ["65%"], []);
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
        break;
      case "transactionHistory":
        props.navigation.navigate("TransactionHistory", {
          id: "transactionHistory",
        });
        break;
      case "inventorySale":
        setSelectedData(undefined)
        props.navigation.navigate('InventorySale', {screeName:InventorySaleScreen.Entry})
        break
      case 'inventoryHistory':
        props.navigation.navigate('InventoryOrderHistory')
        break
      case 'profileDetails':
        props.navigation.navigate('ProfileDetails')
        break
      case 'qrCodeGen':
        props.navigation.navigate('QRShare')
        break
      default:
        console.log(keyStr);
        break;
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
          <Text style={styles.username}>{userDesc}</Text>
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
          handleIndicatorStyle={{ display: "none" }}
          backgroundStyle={{ backgroundColor: "transparent" }}
        >
          <View style={styles.sheets}>
            <View style={styles.transparentView}>
              <TouchableOpacity
                style={styles.crossView}
                onPress={() => bottomSheetRef.current?.close()}
              >
                <Image
                  source={require("../assets/images/whiteCross.png")}
                  style={styles.crossImg}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.contentView}>
              <Image
                source={require("../assets/images/logout.png")}
                style={styles.logoutImg}
              />
              <Text style={styles.confirmLogout}> CONFIRM LOGOUT </Text>
              <Text style={styles.logoutText}>
                Are you sure, you want to logout from services
              </Text>
              <View style={styles.logoutBtn}>
                <OoredooPayBtn
                  onPress={function (): void {
                   APIManager.sharedInstance().removeAuthToken()
                   props.navigation.popToTop()
                  }}
                  title={"CONFIRM"}
                />
              </View>
            </View>
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
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 95,
    alignContent: "center",
    alignItems: "center",
    backgroundColor: ColorConstants.white,
  },
  imageButton: {
    marginHorizontal:10,
    padding: 10,
    width: 25,
    height: 25,
  },
  nameView: {
    height: 170,
    backgroundColor: ColorConstants.grey_F4F4,
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
  sheets: {
    flex: 1,
    backgroundColor: "transparent",
  },
  transparentView: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  crossView: {
    width: 52,
    height: 52,
    backgroundColor: ColorConstants.black,
    opacity: 0.5,
    borderRadius: 52 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  crossImg: {
    width: 20,
    height: 20,
  },
  contentView: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logoutImg: {
    width: 112,
    height: 112,
    marginTop: 20,
    padding: 10,
  },
  confirmLogout: {
    fontFamily: Fontcache.rubikBold,
    fontSize: 18,
    color: ColorConstants.grey_6D6,
    marginTop: 35,
  },
  logoutText: {
    fontFamily: Fontcache.rubikBold,
    fontSize: 14,
    color: ColorConstants.grey_6D6,
    marginTop: 8,
    textAlign: "center",
  },
  logoutBtn: {
    marginLeft: 16,
    marginRight: 16,
    width: "85%",
    marginTop: 20,
    marginBottom: 16,
  },
});

const ProfileServiceData: ExpandableListProps[] = [
  {
    isExpanded: false,
    category_name: "Profile details",
    key: "profileDetails",
    subcategory: [],
  },
  {
    isExpanded: false,
    category_name: "QR Code Generation",
    key: "qrCodeGen",
    subcategory: [],
  },
  {
    isExpanded: false,
    category_name: "Accessories Selling",
    key: "accessorySelling",
    subcategory: [],
  },
  {
    isExpanded: false,
    category_name: "Inventory",
    key: "inventoryTransaction",
    subcategory: [
      {
        id: "inventorySale",
        val: "Inventory Sale",
      },
      {
        id: "inventoryHistory",
        val: "Inventory Order History",
      },
    ],
  },
  {
    isExpanded: false,
    category_name: "Inventory Return",
    key: "returnModule",
    subcategory: [
      {
        id: "refund",
        val: "Refund",
      },
      {
        id: "replacement",
        val: "Replacement",
      },
    ],
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
    category_name: "Convert M-Faisa money",
    key: "faisaToRastas",
    subcategory: [],
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
