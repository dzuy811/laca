import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LoginButton, AppLogo } from '../components';
import FormInput from "../components/FormInput";

interface Props {
    navigation: any;
}

const App: React.FC <Props> = (props) => {
    // const [name, setName] = useState<string | null>(null);
    // const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    // const [password, setPassword] = useState<string | null>(null);
    // const [passwordCf, setPasswordCf] = useState<string | null>(null);

    const [nameValue, setNameValue] = useState<string>("");
    const [phoneValue, setPhoneValue] = useState<string>("");
	const [passwordValue, setPasswordValue] = useState<string>("");
    const [passwordCfValue, setPasswordCfValue] = useState<string>("");


    const handleNameChange = (newText: string) => {
		setNameValue(newText);
	};

    const handlePhoneChange = (newText: string) => {
		setPhoneValue(newText);
	};

	const handlePasswordChange = (newPassword: string) => {
		setPasswordValue(newPassword);
	};

    const handlePasswordCfChange = (newPassword: string) => {
		setPasswordCfValue(newPassword);
	};

    return (  
        <View style={styles.container}>
            <AppLogo />
            <Text style={styles.text}>
                Let's start your journey from here with us!
            </Text>
            <KeyboardAvoidingView
                style={styles.containerForm}
                behavior={"padding"}
		    >
                <FormInput label="Username" value={nameValue} onChangeHandler={handleNameChange} />
                <FormInput label="Phone Number" value={phoneValue} onChangeHandler={handlePhoneChange} />
                <FormInput
                    isSecured={true}
                    label="Password"
                    value={passwordValue}
                    onChangeHandler={handlePasswordChange}
                />
                <FormInput
                    isSecured={true}
                    label="Confirm Password"
                    value={passwordCfValue}
                    onChangeHandler={handlePasswordCfChange}
                />
		    </KeyboardAvoidingView>
            <LoginButton title="SIGN UP" onPress={() => alert("SIGN UP")} />
            <View style={{flexDirection: 'row', marginTop: 20}}>
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
    },
    containerForm: {
        width: "100%",
        marginBottom: 60 
    },
    input: {
        height: 26,
        fontSize: 20,
        color: "#000",
        borderBottomWidth: 1,
        borderBottomColor: "#555",
    },
})