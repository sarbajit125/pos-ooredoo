import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import { ColorConstants } from '../../constants/Colors'

const OoredooCancelBtn = (props: CancelBtnProps) => {
    return (
        <TouchableOpacity
          style={[
            styles.btnView,
            props.style,
            props?.isDisabled ? styles.disabled : styles.enabled,
          ]}
          onPress={props.onPress}
          activeOpacity={0.5}
          disabled={props.isDisabled}
        >
          <Text style={[styles.btnText]}>{props.title}</Text>
        </TouchableOpacity>
      );
}

export default OoredooCancelBtn

const styles = StyleSheet.create({
    btnView:{
        height: 48,
        backgroundColor: ColorConstants.white,
        borderRadius: 50,
        justifyContent: "center",
    },
    btnText: {
        fontFamily: "Rubik_700Bold",
        fontSize: 12,
        lineHeight: 14,
        alignSelf: "center",
        color: ColorConstants.grey_898,
      },
      disabled: {
        opacity: 0.5,
      },
      enabled: {
        opacity: 1.0,
      },
})

export interface CancelBtnProps {
 onPress: () => void;
  style?: ViewStyle;
  title: string;
  isDisabled?: boolean;
}