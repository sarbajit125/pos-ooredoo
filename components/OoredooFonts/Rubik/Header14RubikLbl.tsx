import { StyleSheet, Text, TextProps } from 'react-native'
import React from 'react'
import { ColorConstants } from '../../../constants/Colors'

const Header14RubikLbl = (props: TextProps) => {
  return (
    <Text style={[styles.header, props.style]}>{props.children}</Text>
  )
}

export default Header14RubikLbl

const styles = StyleSheet.create({
    header:{
        fontFamily:'Rubik_700Bold',
        fontSize: 14,
        color: ColorConstants.black,
    },
})