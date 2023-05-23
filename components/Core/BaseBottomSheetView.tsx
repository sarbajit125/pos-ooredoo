import { StyleSheet, Image, TouchableOpacity, View, ViewProps } from 'react-native'
import React from 'react'
import { ColorConstants } from '../../constants/Colors'

const BaseBottomSheetView = (props: BaseBottomSheetProps) => {
  return (
    <View style={styles.sheets}>
        <View style={styles.transparentView}>
              <TouchableOpacity
                style={styles.crossView}
                onPress={() => props.crossBtnAction()}
              >
                <Image
                  source={require("../../assets/images/whiteCross.png")}
                  style={styles.crossImg}
                />
              </TouchableOpacity>
            </View>
    </View>
  )
}

export default BaseBottomSheetView
export interface BaseBottomSheetProps extends ViewProps {
    crossBtnAction: () => void
}

const styles = StyleSheet.create({
    sheets: {
        flex: 1,
        backgroundColor: "transparent",
      },
      transparentView: {
        height: 80,
        justifyContent: "center",
        alignItems: "center",
      },
      crossView: {
        width: 52,
        height: 52,
        backgroundColor: ColorConstants.black,
        opacity: 0.5,
        borderRadius: 52 / 2,
        justifyContent: "center",
        alignItems: "center",
      },
      crossImg: {
        width: 20,
        height: 20,
      },
})