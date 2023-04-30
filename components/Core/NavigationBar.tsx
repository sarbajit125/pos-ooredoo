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
import { TouchableOpacity } from "react-native-gesture-handler";

const NavigationBar = (props: POSNaivgationProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{props.route.name}</Text>
        <Text style={styles.desc}> Write one line of description here</Text>
      </View>
      <View style={styles.imageView}> 
      <TouchableOpacity
          style={styles.image}
          activeOpacity={0.5}
          onPress={() => props.navigation.goBack()}
        >
          <Image style={{width:20, height:20}}  source={require("../../assets/images/backIcon.png")} />
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
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
  imageView:{
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems :'center',
  },
  image: {
    marginHorizontal: 15,
    width: 30,
    height: 30, 
    justifyContent: 'center',
    alignItems :'center',
  },
  titleContainer:{
    alignContent: 'center',
    flex:1,
  },
  grabber:{
    alignContent: 'center',
    backgroundColor: ColorConstants.grey_E0E,
  }
});

export interface POSNaivgationProps extends NativeStackHeaderProps {

}
