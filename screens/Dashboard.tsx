import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { APIManager } from '../AppManger/ApiManger'
import { POSAppManger, POSUserDetailsDAO } from '../AppManger/POSAppManager'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types'
import DashbordNav from '../components/dashboard/DashbordNav'
import DashboardGreeting from '../components/dashboard/DashboardGreeting'
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Dashboard">
const Dashboard = (props: LoginScreenProps) => {
    const [name, setName] = useState('')
    useEffect (()=>{
       APIManager.sharedInstance().userDetails().then((response) => {
        POSAppManger.sharedInstance().currentRole = response.currentRole
        POSAppManger.sharedInstance().SalesChannelIdList = response.salesChannelIdList
        POSAppManger.sharedInstance().UserDetails = new POSUserDetailsDAO(response.userId,
            response.userCredentials.username,
            response.userFirstName,
            response.userAddress.contactNumber,
            response.userCredentials.userDesc,
            response.userLastName)
        POSAppManger.sharedInstance().FaisaWallets = response.walletNumbers.MFaisa.map((item)=> {
            return {
                walletid: item,
                type: "Faisa"
            }
        })
        POSAppManger.sharedInstance().RastasWallets = response.walletNumbers.Raastas.map((id) => (
            {
                walletid: id,
                type: 'Rastas'
            }
        ))
        setName(response.userCredentials.userDesc)

       }).catch ((err) => {
        props.navigation.goBack()
       })
    },[])
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <DashbordNav profileTapped={function (): void {
                 // Laucnh Profile section
              } } notificationTapped={function (): void {
                  // Launch notification 
              } } />
      </View>
      <View style={styles.greetingView} >
        <DashboardGreeting name={name} />
      </View>
      <View style={styles.balanceView}>

      </View>
      <View style={styles.kpiView}>

      </View>
      <View style={styles.graphView}>

      </View>
      <View style={styles.servicesView}>
        <View style={styles.tabView}>
        </View>
      </View>
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
    container:{
        marginTop: 60,
        marginBottom: 20,
        marginLeft: 10,
        marginRight:10,
    },
    topBar:{
        height: 80,
    },
    greetingView:{
        height:80,
    },
    balanceView:{
        backgroundColor:'yellow',
        height:160,
    },
    kpiView:{
        backgroundColor:'green',
        height:80,
    },
    graphView:{
        backgroundColor:'orange',
        height:300,
    },
    servicesView:{
        backgroundColor:'gold',
    },
    tabView:{
        backgroundColor:"pink",
        position: 'absolute',
        width: '80%',
        bottom: 90,
        height: 60,
        alignSelf:"center",
    },
})