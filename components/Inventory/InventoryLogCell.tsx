import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Fontcache } from "../../constants/FontCache";
import { ColorConstants } from "../../constants/Colors";

const InventoryLogCell = (props: InventoryLogCellProps) => {
  return (
    <View style={styles.container}>
      {props.rows.map((item, index) =>
        index === props.rows.length ? (
          <View key={index}> 
            <Text style={styles.label}> {item}</Text>
          </View>
        ) : (
          <View key={index}>
            <Text style={styles.label}> {item}</Text>
            <View style={styles.lineItemSeparator}> </View>
          </View>
        )
      )}
    </View>
  );
};

export default InventoryLogCell;

export interface InventoryLogCellProps {
    rows: string[]
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 5,
  },
  label: {
    fontFamily: Fontcache.notoRegular,
    fontSize: 12,
    padding: 5,
    marginHorizontal: 8,
  },
  lineItemSeparator: {
    width: 4,
    marginVertical: 10,
    backgroundColor: ColorConstants.grey_898,
    alignSelf: "center",
  },
});
