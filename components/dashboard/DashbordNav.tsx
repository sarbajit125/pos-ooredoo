import { StyleSheet, View, Image, TouchableHighlight  } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { ColorConstants } from '../../constants/Colors';
const DashbordNav = (props: DashboardNavProps) => {
  return (
    <View style={styles.container}>
        <Image source={require("../../assets/images/ooredoo-logo.png")}  style={styles.logo}/>
        <View style={styles.iconsView} >
            <TouchableHighlight  onPress={props.profileTapped} style= {styles.icon}>
            <FontAwesome5 name="user" size={18} color={ColorConstants.grey_898} />
            </TouchableHighlight >
            <TouchableHighlight onPress={props.notificationTapped} style= {styles.icon} >
                <Ionicons name="ios-notifications-outline" size={18} color={ColorConstants.grey_898} />
            </TouchableHighlight >
        </View>
    </View>
  )
}

export default DashbordNav
type DashboardNavProps = {
    profileTapped: () => void;
    notificationTapped: () => void;
}
const styles = StyleSheet.create({
    logo:{
        width: 100,
        height: 21,
    },
    icon:{
        padding: 5,
        marginLeft: 30,
    },
    container:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    iconsView:{
        padding: 5,
        flexDirection:'row',
        justifyContent: 'space-around',
    },
})