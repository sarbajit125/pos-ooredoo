import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from "react-native";
import React from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { ColorConstants } from "../../constants/Colors";
import { Fontcache } from "../../constants/FontCache";

const NavigationBar = (props: POSNaivgationProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{props.route.name}</Text>
        <TouchableHighlight
          style={styles.image}
          onPress={() => props.navigation.goBack()}
        >
          <Image  source={require("../../assets/images/backIcon.png")} />
        </TouchableHighlight>
      </View>
      <Text style={styles.desc}> Write one line of description here</Text>
    </View>
  );
};

export default NavigationBar;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 20,
    height: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    marginTop: 17,
    marginHorizontal: 5,
    fontFamily: Fontcache.rubikBold,
    fontSize: 20,
    color: ColorConstants.black,
  },
  desc: {
    marginHorizontal: 5,
    fontFamily: Fontcache.notoRegular,
    fontSize: 16,
    color: ColorConstants.black,
  },
  image: {
    marginHorizontal: 15,
    width: 11,
    height: 11, 
  },
  titleContainer:{
    flexDirection: 'row',
    justifyContent:'space-between',
    alignContent: 'center',
    alignItems:'center',
  },
  grabber:{
    alignContent: 'center',
    backgroundColor: ColorConstants.grey_E0E,
    
  }
});

export interface POSNaivgationProps extends NativeStackHeaderProps {

}
