import { StyleSheet, View } from 'react-native'
import React, { useContext } from 'react'
import Header14RubikLbl from '../OoredooFonts/Rubik/Header14RubikLbl'
import Title26Noto from '../OoredooFonts/Noto/Title26Noto'
import { observer } from 'mobx-react'
import { StoresContext } from '../../store/RootStore'

const DashboardGreeting = observer(() => {
    const userStore = useContext(StoresContext).userDetailStore
    return (
      <View style={styles.container}>
          <Header14RubikLbl>
              Hello,
          </Header14RubikLbl>
          <Title26Noto style={styles.name}>
              {userStore.userDesc}
          </Title26Noto>
      </View>
    )
  }) 

export default DashboardGreeting

const styles = StyleSheet.create({
    container:{

    },
    name:{
        marginTop: 8,
    }
})