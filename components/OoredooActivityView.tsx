import { ActivityIndicator, Dimensions, Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ColorConstants } from '../constants/Colors'
import Header14Noto from './OoredooFonts/Noto/Header14Noto'
import { Fontcache } from '../constants/FontCache'

const OoredooActivityView = () => {
  return (
    <View  style={styles.centeredView}>
       <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
             <ActivityIndicator size='large' color={ColorConstants.red_ED1} />
             <Header14Noto style={styles.text}>Loading...</Header14Noto>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default OoredooActivityView

const styles = StyleSheet.create({
    text: {
      padding: 10,
      color: ColorConstants.black,
      fontFamily: Fontcache.notoRegular
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      flexDirection: 'row',
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
})