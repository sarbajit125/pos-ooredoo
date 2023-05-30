import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React from "react";
import { ColorConstants } from "../../constants/Colors";
import { Fontcache } from "../../constants/FontCache";

const InventoryDetailCard = (props: InventoryCardDetailsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headingView}>
        <Text style={styles.headingText}>{props.orderHeading}</Text>
      </View>
      {props.rows.map((item, index) => (
        <View style={styles.rows} key={index}>
          <Text style={styles.rowsText}>{item.key}</Text>
          {item.type === "image" ? (
            <TouchableOpacity
              style={styles.imageView}
              onPress={() => item.valueTapped && item.valueTapped(item.key)}
            >
              <Image source={item.imageURL} style={styles.image} />
            </TouchableOpacity>
          ) : (
            <Text style={styles.rowsText}>{item.value}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

export default InventoryDetailCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: ColorConstants.grey_898,
    borderWidth: 2,
    borderRadius: 8,
  },
  headingView: {
    height: 40,
    alignContent: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth:1,
    borderBottomColor:  ColorConstants.grey_AAA,
  },
  headingText: {
    fontFamily: Fontcache.notoRegular,
    fontSize: 18,
    color: ColorConstants.red_ED1,
    padding:5,
  },
  rows: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  rowsText: {
    flex:1,
    flexBasis: "50%",
    fontFamily: Fontcache.notoRegular,
    fontSize: 14,
    color: ColorConstants.black,
    padding:5,
  },
  imageView: {
    width: 25,
    height: 25,
    padding:5,
    flexBasis: "50%",
  },
  image: {
    width: 25,
    height: 25,
  },
});

export interface InventoryCardDetailsProps {
  orderHeading: string;
  rows: InventoryCardRows[];
}

export interface InventoryCardRows {
  key: string;
  value?: string;
  type: "text" | "image";
  imageURL?: ImageSourcePropType | undefined;
  valueTapped?: (key: string) => void;
}
