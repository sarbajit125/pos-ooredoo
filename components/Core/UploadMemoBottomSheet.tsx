import { StyleSheet, Text, Touchable, View, Image } from "react-native";
import React, { useState } from "react";
import { ColorConstants } from "../../constants/Colors";
import OoredooBorderedView from "./OoredooBorderedView";
import { TouchableOpacity } from "react-native-gesture-handler";
import Header13RubikLbl from "../OoredooFonts/Rubik/Header13RubikLbl";
import OoredooPayBtn from "../OoredooPayBtn";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
const UploadMemoBottomSheet = ({
  confirmBtnCallback,
  orderId
}: UploadMemoBottomSheetProps) => {
  const [checkboxSelected, setSelection] = useState<boolean>(false);
  const [fileSelected, setFileSelected] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] =
    useState<DocumentPicker.DocumentResult | null>(null);
  const [fileName, setFileName] = useState<string>("Pick a PDF document");

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (result.type === "success") {
      setSelectedDoc(result);
      setFileName(result.name)
      setFileSelected(true);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <OoredooBorderedView
          text={fileName}
          additionalViewStyle={styles.textFieldView}
        />
        <TouchableOpacity
          style={styles.imageView}
          onPress={() => pickDocument()}
        >
          <Ionicons name="cloud-upload" size={50} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.selectionView}>
        <TouchableOpacity
          style={styles.checkBoxView}
          onPress={() => setSelection(!checkboxSelected)}
        >
          {checkboxSelected ? (
            <MaterialCommunityIcons
              name="checkbox-marked-outline"
              size={25}
              color="black"
            />
          ) : (
            <MaterialCommunityIcons
              name="checkbox-blank-outline"
              size={25}
              color="black"
            />
          )}
        </TouchableOpacity>
        <Header13RubikLbl style={styles.checkboxText}>
          Do you want to upload Memo ?
        </Header13RubikLbl>
      </View>
      <View style={styles.btnView}>
        <OoredooPayBtn
          isDisabled={
            (!(checkboxSelected && fileSelected) || !checkboxSelected)
          }
          onPress={() => confirmBtnCallback(checkboxSelected, selectedDoc, orderId)}
          title={"Confirm"}
        />
      </View>
    </View>
  );
};

export default UploadMemoBottomSheet;

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: ColorConstants.white,
    flex: 1,
  },
  textView: {
    marginVertical: 10,
    flexDirection: "row",
    marginHorizontal: 8,
  },
  textFieldView: {
    flex: 1,
  },
  imageView: {
    padding: 5,
    marginHorizontal: 2,
    width: 65,
    height: 50,
  },
  image: {
    width: 65,
    height: 50,
  },
  selectionView: {
    marginVertical: 5,
    flexDirection: "row",
    marginHorizontal: 8,
    alignItems:'center',
  },
  checkBoxView: {
    width: 30,
    height: 30,
  },
  checkBox: {
    width: 25,
    height: 25,
  },
  checkboxText: {
    flex: 1,
    marginHorizontal: 5,
  },
  btnView: {
    marginVertical: 16,
    marginHorizontal: 8,
    padding: 5,
  },
});

export interface UploadMemoBottomSheetProps {
  orderId: number
  confirmBtnCallback: (
    shouldUpload: boolean,
    selectedFile: DocumentPicker.DocumentResult | null,
    orderId: number
  ) => void;
}
