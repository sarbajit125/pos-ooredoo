import { useState, useEffect } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Text, StyleSheet } from "react-native";
import { ColorConstants } from "../../constants/Colors";
import { Fontcache } from "../../constants/FontCache";

export const ExpandableComponent = ({ item, onClick }: ExpandableCellProps) => {
  //Custom Component for the Expandable List
  const [layoutHeight, setLayoutHeight] = useState(0);
  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(64);
    } else {
      setLayoutHeight(0);
    }
  }, [item.isExpanded]);

  return (
    <View>
      {/*Header of the Expandable List Item*/}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onClick(item.key)}
        style={styles.header}
      >
        <Text style={styles.headerText}>{item.category_name}</Text>
        {item.subcategory.length > 0 ? (
          item.isExpanded ? (
            <Image
              style={styles.plus}
              source={require("../../assets/images/navigation_minus.png")}
            />
          ) : (
            <Image
              style={styles.plus}
              source={require("../../assets/images/navigation_plus.png")}
            />
          )
        ) : (
          <Image
            style={styles.plus}
            source={require("../../assets/images/navigation_right.png")}
          />
        )}
      </TouchableOpacity>
      {/*Content under the header of the Expandable List Item*/}
      {item.subcategory.length > 0 &&
        item.subcategory.map((item, key) => (
          <View
          key={key}
            style={{
              height: layoutHeight,
              overflow: "hidden",
            }}
          >
            <TouchableOpacity
              key={key}
              style={styles.content}
              onPress={() => onClick(item.id)}
            >
              <Text style={styles.text}>{item.val}</Text>
              <Image
            style={styles.plus}
            source={require("../../assets/images/navigation_right.png")}
          />
            </TouchableOpacity>
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: ColorConstants.white,
    borderBottomColor: ColorConstants.grey_898,
    borderBottomWidth: 1,
    height: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: ColorConstants.black,
    fontFamily: Fontcache.notoLight,
    fontSize: 18,
    padding: 10,
  },
  text: {
    color: ColorConstants.black,
    fontFamily: Fontcache.notoLight,
    fontSize: 18,
    padding: 15,
    marginLeft: 20,
  },
  content: {
    backgroundColor: ColorConstants.white,
    height: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plus: {
    width: 7,
    height: 13,
    padding: 5,
    marginRight: 20,
  },
});
export interface ExpandableListProps {
  isExpanded: boolean;
  category_name: string;
  subcategory: ListSubCategory[];
  key: string,
}
export interface ListSubCategory {
  id: string;
  val: string;
}
export interface ExpandableCellProps {
  item: ExpandableListProps;
  onClick: (key: string) => void;
}
