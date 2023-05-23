import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { fetchSelfDetails } from "../query-hooks/QueryHooks";
import { SafeAreaView } from "react-native-safe-area-context";
import OoredooActivityView from "../components/OoredooActivityView";
import SelectedModCell from "../components/Core/SelectedModCell";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { POSSelectData, RootStackParamList } from "../types";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import BaseBottomSheetView from "../components/Core/BaseBottomSheetView";
import { ColorConstants } from "../constants/Colors";
import OoredooPayBtn from "../components/OoredooPayBtn";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import CrossButtonView from "../components/Core/BaseBottomSheetView";
const ProfileDetails = (props: ProfileDetailsNavProps) => {
  const [userRoles, setUserRoles] = useState<POSSelectData[]>([]);
  // ref
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ["65%"], []);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const { data, isSuccess, isError, error, isFetching } = fetchSelfDetails();

  const renderRoleCell = (cell: ListRenderItemInfo<POSSelectData>) => {
    return (
      <TouchableOpacity
        onPress={() => selectNewRole(cell.item)}
        style={styles.roleCell}
      >
        <FontAwesome name="users" size={30} color="black" />
        <Text style={styles.roleText}>{cell.item.name}</Text>
        {cell.item.isSelected ? (
          <Ionicons
            name="checkmark-circle-outline"
            size={25}
            color="black"
            style={styles.checkbox}
          />
        ) : (
          <MaterialIcons
            name="radio-button-unchecked"
            size={24}
            color="black"
            style={styles.checkbox}
          />
        )}
      </TouchableOpacity>
    );
  };
  const selectNewRole = (selected: POSSelectData) => {
    setUserRoles((prev) =>
      prev.map((item) => (item.id === selected.id ? selected : item))
    );
  };
  if (isSuccess && !isFetching) {
    return (
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.cell}>
            <SelectedModCell
              rightViewType={"none"}
              text={data.userAddress.contactNumber}
              id={"MOBILE"}
              heading="Mobile Number"
              modifyCallback={() => console.log("MOBILE")}
            />
          </View>
          <View style={styles.cell}>
            <SelectedModCell
              rightViewType={"none"}
              text={data.userFirstName + data.userLastName}
              id={"NAME"}
              heading="Name"
              modifyCallback={function (id: string): void {
                throw new Error("Function not implemented.");
              }}
            />
          </View>
          <View style={styles.cell}>
            <SelectedModCell
              rightViewType={"button"}
              text={data.currentRole}
              id={"CURRENT ROLE"}
              heading="Current Role"
              buttonTitle="Change"
              modifyCallback={() => {
                setUserRoles(
                  data.userAuthorities.map((item) => ({
                    id: item.authority,
                    name: item.authority,
                    isSelected:
                      item.authority === data.currentRole ? true : false,
                  }))
                );
                bottomSheetRef.current?.present();
              }}
            />
          </View>
          <View style={styles.cell}>
            <SelectedModCell
              rightViewType={"none"}
              text={data.userAddress.emailId}
              id={"EMAIL"}
              heading="Email"
              modifyCallback={() => console.log("MOBILE")}
            />
          </View>
          <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            handleIndicatorStyle={{ display: "none" }}
            backgroundStyle={{ backgroundColor: "transparent" }}
          >
            <View style={styles.sheets}>
              <CrossButtonView
                crossBtnAction={() => bottomSheetRef.current?.close()}
              />
              <View style={styles.bottomSheetContentView}>
                <View style={styles.mainView}>
                  <FlatList
                    data={userRoles}
                    keyExtractor={(item) => item.id}
                    renderItem={(item) => renderRoleCell(item)}
                  />
                </View>
                <View style={styles.btnView}>
                  <OoredooPayBtn
                    onPress={() => console.log("")}
                    title={"Confirm"}
                  />
                </View>
              </View>
            </View>
          </BottomSheetModal>
        </SafeAreaView>
      </BottomSheetModalProvider>
    );
  } else if (isError) {
    return <SafeAreaView style={styles.container}></SafeAreaView>;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <OoredooActivityView />
      </SafeAreaView>
    );
  }
};

export default ProfileDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cell: {
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 3,
  },
  bottomSheetContentView: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flex: 1,
    marginTop: 2,
    backgroundColor: ColorConstants.white,
  },
  btnView: {
    marginVertical: 16,
    marginHorizontal: 8,
    padding: 5,
  },
  mainView: {},
  roleCell: {
    height: 80,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: ColorConstants.grey_E0E,
    marginVertical: 8,
    marginHorizontal: 5,
  },
  roleText: {
    marginHorizontal: 5,
    padding: 2,
    flex: 1,
    color: ColorConstants.black,
  },
  checkbox: {
    flexBasis: "10%",
  },
  sheets: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
type ProfileDetailsNavProps = NativeStackScreenProps<
  RootStackParamList,
  "ProfileDetails"
>;
