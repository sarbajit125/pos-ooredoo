import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { InventorySaleScreen, RootStackParamList } from '../types'
import OoredooPayBtn from '../components/OoredooPayBtn'

const InventorySale = (props: InventorySaleProps) => {
    const [pageName, setPage] = useState<InventorySaleScreen>(InventorySaleScreen.Entry)

    useEffect(() => {
        switch (props.route.params.screeName) {
          case InventorySaleScreen.Entry:
            props.navigation.setOptions({ title: "Inventory Sale" });
            break
            default:
                props.navigation.setOptions({ title: "Inventory Sale" });
                break
        }
      }, []);
    const setButtonTitle =  () : string =>  {
        switch (pageName) {
            case InventorySaleScreen.Validate:
                return "Validate"
            default:
                return "Next"
        } 
    }
  return (
    <SafeAreaView style={styles.containerView}>
    <View >
        <View style={styles.cardViews} >
        </View >
        <View style={styles.dropDownView}>
     </View>
    </View>
    <View style={styles.buttonView}>
        <OoredooPayBtn onPress={function (): void {
                  throw new Error('Function not implemented.')
              } } title={'Next'} />
    </View>
    </SafeAreaView>
  )
}

export default InventorySale

const styles = StyleSheet.create({
    containerView:{
        flex: 1,
        backgroundColor:'green',
        flexGrow:1,
    },
    buttonView:{
        bottom: 5,
        marginHorizontal: 10,
    },
    dropDownView:{
        backgroundColor:'yellow',
        height:100,
    },
    cardViews:{
        height:100,
        backgroundColor:'red',
    }
})
type InventorySaleProps = NativeStackScreenProps<RootStackParamList, 'InventorySale'>