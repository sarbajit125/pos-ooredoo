import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import OoredooPayBtn from "../OoredooPayBtn";
import InventoryLogCell from "./InventoryLogCell";
import { ColorConstants } from "../../constants/Colors";
import { Fontcache } from "../../constants/FontCache";

const InventoryHistoryModal = ({
  closeModalAction,
  heading,
  rows,
  modalVisible,
  btnHeading,
}: InventoryHistoryModalProps) => {
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.headingView}>
            <Text style={styles.headingText}>{heading}</Text>
          </View>
          <ScrollView style={styles.table}>
            {rows.map((item, index) => (
              <InventoryLogCell rows={item}  id={index} />
            ))}
          </ScrollView>
          <View style={styles.btnView}>
            <OoredooPayBtn
              onPress={() => closeModalAction()}
              title={btnHeading || "Cancel"}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default InventoryHistoryModal;

export interface InventoryHistoryModalProps {
  heading: string;
  modalVisible: boolean;
  closeModalAction: () => void;
  rows: string[][];
  btnHeading?: string;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorConstants.white,
    height: 180,
    borderRadius: 8,
    margin: 16,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  headingView: {
    height: 40,
    alignContent: "center",
    alignItems:'center',
    borderBottomWidth: 1,
    borderBottomColor: ColorConstants.grey_AAA,
    padding:2,
  },
  headingText: {
    fontFamily: Fontcache.notoRegular,
    fontSize: 18,
    color: ColorConstants.red_ED1,
    padding: 5,
  },
  table: {
    flex: 1,
  },
  cell: {},
  btnView: {
    height: 40,
    marginVertical: 10,
    padding: 2,
  },
});
