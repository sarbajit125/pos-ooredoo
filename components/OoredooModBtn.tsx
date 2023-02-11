import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ColorConstants } from '../constants/Colors'
import { ViewStyle } from 'react-native'

const OoredooModBtn = (props:PayBtnProps) => {
  return (
    <TouchableOpacity style={[styles.btnView, props.style]} onPress={props.onPress} activeOpacity={0.5}>
        <Text style={[styles.btnText]}>
        {props.title}  
        </Text>
    </TouchableOpacity>
  )
}
export default OoredooModBtn

const styles = StyleSheet.create({
    btnView:{
        height:29,
        width:70,
        backgroundColor: ColorConstants.red_ED1,
        borderRadius: 50,
        justifyContent:"center",
    },
    btnText:{
        fontFamily: "Rubik_700Bold",
        fontSize: 12,
        lineHeight: 14,
        alignSelf:'center',      
        color: ColorConstants.white,
    }
})

type PayBtnProps = {
    onPress: () => void,
    style: ViewStyle,
    title: string,
}