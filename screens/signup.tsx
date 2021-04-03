import { useLinkProps } from "@react-navigation/native";
import React, { FC, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LoginButton, AppLogo } from '../components';

interface Props {
    navigation: any;
}

const App: FC <Props> = (props) => {
    const [name, setName] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [passwordCf, setPasswordCf] = useState<string | null>(null);

    return (  
        <View style={styles.container}>
            <AppLogo />
            <Text style={styles.text}>
                Let's start your journey from here with us!
            </Text>
            <Text style={styles.text}>
                ___________________________
            </Text>
            <LoginButton title="SIGN UP" onPress={() => alert("SIGN UP")} />
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.text}>Already have an account? </Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('login')}>
                    <Text style={styles.textLogin}>Sign in</Text>
                </TouchableOpacity>
            </View>
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
    },
    text: {
        color: "#FFF",
        fontWeight: "normal",
        marginBottom: 15,
    },
    textLogin: {
        color: "#FFF",
        fontWeight: "normal",
        marginBottom: 15,
        textDecorationLine: 'underline'
    }
})