import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Fontcache } from "../../constants/FontCache";
import { ColorConstants } from "../../constants/Colors";

const InventoryLogCell = (props: InventoryLogCellProps) => {
  return (
    <View style={styles.container}>
      {props.rows.map((item, index) => (
        <View
          key={index}
          style={{
            flexBasis: `${(100 / props.rows.length).toFixed()}%`,
            flexDirection: "row",
           
          }}
        >
          <Text style={styles.label}> {item}</Text>
          {(props.rows.length -1) === index ? null : 
            (<View style={styles.lineItemSeparator}>{}</View>
          )}
        </View>
      ))}
    </View>
  );
};

export default InventoryLogCell;

export interface InventoryLogCellProps {
  rows: string[];
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
    flex:1,
  },
  lineItemSeparator: {
    width: 2,
    backgroundColor: ColorConstants.grey_898,
  },
});
