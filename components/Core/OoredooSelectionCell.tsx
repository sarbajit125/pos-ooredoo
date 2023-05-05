import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import CellSepratorView from '../History/CellSepratorView'
import { ColorConstants } from '../../constants/Colors'
import { Fontcache } from '../../constants/FontCache'
import { POSSelectData } from '../../types'

const OoredooSelectionCell = ({data, selectionCallback}: SelectionCellProps) => {
  return (
    <View>
    <TouchableOpacity
      style={styles.cell}
      onPress={() => selectionCallback(data)}
    >
      {data.isSelected ? (
        <Image
          style={styles.image}
          source={require("../../assets/images/checkedbox.png")}
        />
      ) : (
        <Image
          style={styles.image}
          source={require("../../assets/images/uncheckedbox.png")}
        />
      )}
      <Text style={styles.cellText}>{data.name}</Text>
    </TouchableOpacity>
    <CellSepratorView marginTop={10} />
  </View>
  )
}

export default OoredooSelectionCell

const styles = StyleSheet.create({
    cell: {
        height: 60,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        padding: 10,
      },
      image: {
        width: 20,
        height: 20,
      },
      cellText: {
        marginHorizontal: 5,
        fontFamily: Fontcache.notoRegular,
        fontSize: 14,
        color: ColorConstants.black,
      },
})
export interface  SelectionCellProps {
    data: POSSelectData
    selectionCallback: (item: POSSelectData) => void
}