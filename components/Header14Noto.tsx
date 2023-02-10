import { StyleSheet, Text, TextProps, View } from 'react-native'
import React from 'react'
import { ColorConstants } from '../constants/Colors'

const Header14Noto = (props:TextProps) => {
  return (
      <Text style={[styles.default, props.style]} {...props}>{props.children}</Text>
  )
}

export default Header14Noto

const styles = StyleSheet.create({
    default:{
      fontFamily:"NotoSans_400Regular",
      fontSize: 14,
      color: ColorConstants.black
    }
})