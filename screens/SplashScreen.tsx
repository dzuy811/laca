import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { AppLogo } from '../components';


const SplashScreen = () => {


    return (
        <View style={styles.container}>
            <AppLogo />
            <Text style={styles.text}>
                Let's start your journey from here with us!
            </Text>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4B8FD2',
        alignItems: 'center',
        paddingTop: 200
    },
    text: {
        fontSize: 20,
        fontWeight: '400',
        color: '#fff'
    }

})

export default SplashScreen