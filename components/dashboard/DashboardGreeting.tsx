import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header14RubikLbl from '../Header14RubikLbl'
import Title26Noto from '../Title26Noto'

const DashboardGreeting = (props: DashboardGreetingProps) => {
  return (
    <View style={styles.container}>
        <Header14RubikLbl>
            Hello,
        </Header14RubikLbl>
        <Title26Noto style={styles.name}>
            {props.name}
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

type DashboardGreetingProps = {
    name: string;
}