import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'
import { ColorConstants } from '../../constants/Colors'
import NotoRegular18 from '../OoredooFonts/Noto/NotoRegular18'

const OoredooBorderedView = ({text, additionalViewStyle}: borderedViewProps) => {
  return (
    <View style={[styles.cell, additionalViewStyle]}>
        <NotoRegular18 style={[styles.text]}>
            {text}
        </NotoRegular18>
    </View>
  )
}

export default OoredooBorderedView

const styles = StyleSheet.create({
    cell:{
        height: 64,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: ColorConstants.grey_E0E,
        backgroundColor: ColorConstants.white,
        justifyContent:'center',
    },
    text: {
        marginHorizontal: 5,
        padding:2,
        flexWrap:'nowrap',
    }
})
export interface borderedViewProps {
    text: string,
    additionalViewStyle?:  StyleProp<ViewStyle>
}