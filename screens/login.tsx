import React, { FC } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from '../components';

const App : FC = () => {
    return(
        <View style={styles.container}>
            <Text>Duy</Text>
            <Button title="LOGIN" onPress={() => alert("Test successfully!")} />
        </View>
    )
}

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})