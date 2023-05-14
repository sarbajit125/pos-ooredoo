import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { InventoryAllocateContext } from "../store/RootStore";
import {
  FetchInventoryProduct,
  FireSerialsForUser,
  checkResponseIfProduct,
} from "../query-hooks/QueryHooks";
import { SafeAreaView } from "react-native-safe-area-context";
import OoredooTextInput from "../components/OoredooTextInput";
import OoredooPayBtn from "../components/OoredooPayBtn";
import OoredooActivityView from "../components/OoredooActivityView";
import OoredooBadReqView from "../components/errors/OoredooBadReqView";
import Header14RubikLbl from "../components/OoredooFonts/Rubik/Header14RubikLbl";

const InventoryConfirmation = () => {
  const { type, productURL, selectedProductId } = InventoryAllocateContext();
  const { data, isSuccess, isLoading, isError, error } =
    FetchInventoryProduct(productURL);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [enteredQuantity, setEnteredQuantity] = useState<number>(0);
  const {
    mutate,
    data: serialData,
    isSuccess: serialSuccess,
    isLoading: serialLoading,
    isError: serialError,
  } = FireSerialsForUser({
    invCategory: "Y",
    inventoryType: selectedProductId.toString(),
    poDateFrom: "2023-05-03",
    poDateTo: "2023-05-15",
  });

  useEffect(() => {
    handleSerialAPIResponse()
  },[serialSuccess, serialLoading, serialError])

  const handleSerialAPIResponse = () => {
    if (serialSuccess) {
      
    }
  }
  if (isSuccess) {
    if (!checkResponseIfProduct(data)) {
      const selectedProduct = data.filter(
        (item) => item.inventoryTypeid === selectedProductId
      );
      if (selectedProduct.length === 0) {
      } else {
        if (type === "R") {
          return (
            <SafeAreaView style={styles.mainContainer}>
              <View>
                <Header14RubikLbl> Product details</Header14RubikLbl>
                <Text>Name: {selectedProduct[0].inventoryTypeDescription}</Text>
                <Text>Product Id: {selectedProduct[0].inventoryTypeid}</Text>
                <Text>Current Stock: {selectedProduct[0].currentStock}</Text>
              </View>
              <View>
                <Header14RubikLbl> Request Quantity</Header14RubikLbl>
                <OoredooTextInput
                  value={enteredQuantity.toString()}
                  placeholder="Enter Quantity"
                  onChangeText={(str) => setEnteredQuantity(parseInt(str))}
                  showError={undefined}
                />
              </View>
              <View>
                <OoredooPayBtn
                  onPress={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  title={"Confirm"}
                />
              </View>
            </SafeAreaView>
          );
        } else {
          return (
            <SafeAreaView style={styles.mainContainer}>
              <View>
                <Header14RubikLbl> Product details</Header14RubikLbl>
                <Text>Name: {selectedProduct[0].inventoryTypeDescription}</Text>
                <Text>Product Id: {selectedProduct[0].inventoryTypeid}</Text>
                <Text>Current Stock: {selectedProduct[0].currentStock}</Text>
                <Text>Selected For Transfer:</Text>
              </View>
            </SafeAreaView>
          );
        }
      }
    }
  } else if (isLoading) {
    return <OoredooActivityView />;
  } else if (isError) {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <OoredooBadReqView
          modalVisible={showModal}
          action={function (): void {
            throw new Error("Function not implemented.");
          }}
          title={errMsg}
        />
      </SafeAreaView>
    );
  } else {
    return <SafeAreaView></SafeAreaView>;
  }
};
export default InventoryConfirmation;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexGrow: 1,
  },
});
export interface InventoryConfirmationProps {
  type: "P" | "R";
  productURL: string;
  selectedProductId: number;
  setType: (type: "P" | "R") => void;
  setProductURL: (urlStr: string) => void;
  setProductId: (id: number) => void;
  reset: () => void;
}
