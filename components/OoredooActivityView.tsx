import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ColorConstants } from '../constants/Colors'

const OoredooActivityView = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={ColorConstants.red_ED1} />
      <Text>Loading...</Text>
    </View>
  )
}

export default OoredooActivityView

const styles = StyleSheet.create({
    container:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        flex: 1,
        flexDirection: 'row'
    },
    overlay:{

    },
})