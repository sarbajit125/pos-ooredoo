import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ColorConstants } from '../../constants/Colors'

const CellSepratorView = (props: CellSepratorViewProps) => {
  return (
    <View style={{
        marginHorizontal: 8,
        height: 2,
        backgroundColor: ColorConstants.grey_898,
        marginVertical: props.marginTop
    }}>
    </View>
  )
}

export default CellSepratorView

export interface CellSepratorViewProps {
    marginTop: number
}