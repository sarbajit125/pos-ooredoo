import { Modal, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import OoredooPayBtn from '../OoredooPayBtn'

const OoredooBadReqView = (props: OoredooBadReqProps) => {
  return (
    <View  style={styles.centeredView}>
       <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible}
        onRequestClose={() => {
         props.action()
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image style={styles.image} source={require('../../assets/images/warning.png')} />
            <Text style={styles.modalText}>Something went wrong</Text>
            <Text style={styles.modalText}>{props.title}</Text>
            <OoredooPayBtn style={styles.button} onPress={ () => props.action()}  title={'Retry'} />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export interface OoredooBadReqProps {
    modalVisible: boolean
    action: ()=> void
    title: string
}

export default OoredooBadReqView

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
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
      flexWrap: 'wrap',
    },
    image:{

    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    button: {
      width: 140,
    }
  });