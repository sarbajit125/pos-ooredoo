import { StyleSheet, Text, TextProps } from 'react-native'
import React from 'react'
import { ColorConstants } from '../../../constants/Colors'

const Header13RubikLbl = (props: TextProps) => {
  return (
    <Text style={[styles.header, props.style]}>{props.children}</Text>
  )
}

export default Header13RubikLbl

const styles = StyleSheet.create({
    header:{
        fontFamily:'Rubik_700Bold',
        fontSize: 13,
        color: ColorConstants.grey_898
    },
})