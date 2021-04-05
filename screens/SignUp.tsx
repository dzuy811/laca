import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LoginButton, AppLogo } from '../components';
import FormInput from "../components/FormInput";
import firebase from 'firebase'
import auth from '@react-native-firebase/auth';

interface Props {
    navigation: any;
}

const SignUp: React.FC <Props> = (props): JSX.Element => {
    const [emailValue, setNameValue] = useState<string>("");
    const [phoneValue, setPhoneValue] = useState<string>("");
	const [passwordValue, setPasswordValue] = useState<string>("");
    const [passwordCfValue, setPasswordCfValue] = useState<string>("");
    const [errorValidation, setErrorValidation] = useState<string>("");

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

    const errorValidationSet = (newText: string) => {
		setErrorValidation(newText);
	};

    const signUp = async () => {
        var pattern = /^\d+$/;
        if(emailValue && phoneValue && passwordValue) {
            try {
                // Check password and confirm password
                if(!(passwordValue === passwordCfValue)) {
                    errorValidationSet("Error: Password is not matching.");

                // Check phone number
                } else if(!(pattern.test(phoneValue))) {
                    errorValidationSet("Error: Phone number only contains number.");
                } 
                // Check email account
                else {                        
                    alert("Success");
                    const user = await firebase.auth().createUserWithEmailAndPassword(emailValue, passwordValue).then(user => {
                    });
                    if(user) {
                        await firebase.firestore().collection('user').doc(user.uid).set({emailValue, phoneValue, passwordValue})
                        alert("Success");
                    } 
                }
            } catch (error) {
                errorValidationSet(String(error));
            }
        } else {
            Alert.alert(`Error`, `Missing Fields`);
        }
    }

    return (  
        <View style={styles.container}>
            <AppLogo />
            <Text style={styles.text}>
                Let's start your journey from here with us!
            </Text>
            <Text style={{color: "red"}}>
                {errorValidation.substring(7)}
            </Text>
            <KeyboardAvoidingView
                style={styles.containerForm}
                behavior={"padding"}
		    >
                <FormInput label="Email" value={emailValue} onChangeHandler={handleNameChange} />
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
            <LoginButton title="SIGN UP" onPress={signUp} />
            <View style={{flexDirection: 'row', marginTop: 20}}>
                <Text style={styles.text}>Already have an account? </Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('login')}>
                    <Text style={styles.textLogin}>Sign in</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SignUp;

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