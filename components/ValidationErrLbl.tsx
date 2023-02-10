import { StyleSheet, Text, TextProps, View } from 'react-native'
import React from 'react'
import { ColorConstants } from '../constants/Colors'

const ValidationErrLbl = (props: TextProps) => {
  return (
      <Text style={[styles.default, props.style]} {...props}>{props.children}</Text>
  )
}

export default ValidationErrLbl

const styles = StyleSheet.create({
    default:{
        fontFamily:"Rubik_700Bold",
        fontSize:14,
        color: ColorConstants.red_ED1,
        marginTop: 3,
        padding:5,
    },
})