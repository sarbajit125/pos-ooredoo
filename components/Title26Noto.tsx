import { StyleSheet, Text, TextProps } from 'react-native'
import React from 'react'
import { ColorConstants } from '../constants/Colors'

const Title26Noto = (props: TextProps) => {
  return (
    <Text style={[styles.header, props.style]}>{props.children}</Text>
  )
}
export default  Title26Noto
const styles = StyleSheet.create({
    header:{
        fontFamily:'NotoSans_400Regular',
        fontSize: 26,
        color: ColorConstants.black,
    },
})