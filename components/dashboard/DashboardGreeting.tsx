import { StyleSheet, View } from 'react-native'
import React, { useContext } from 'react'
import Header14RubikLbl from '../OoredooFonts/Rubik/Header14RubikLbl'
import Title26Noto from '../OoredooFonts/Noto/Title26Noto'
import { fetchSelfDetails } from '../../query-hooks/QueryHooks'

const DashboardGreeting = () => {
    const { data, isSuccess} = fetchSelfDetails()
    return (
      <View style={styles.container}>
          <Header14RubikLbl>
              Hello,
          </Header14RubikLbl>
          <Title26Noto style={styles.name}>
              { isSuccess && data.userCredentials.userDesc}
          </Title26Noto>
      </View>
    )
  }

export default DashboardGreeting

const styles = StyleSheet.create({
    container:{

    },
    name:{
        marginTop: 8,
    }
})