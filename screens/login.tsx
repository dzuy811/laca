import React, { FC } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { LoginButton } from '../components';

const App : FC = () => {
    return(
        <View style={styles.container}>
            <LoginButton title="LOGIN" onPress={() => alert("LOGIN")} />
            <LoginButton title="SIGN UP" onPress={() => alert("SIGN UP")} />
        </View>
    )
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#4B8FD2"
    }
})