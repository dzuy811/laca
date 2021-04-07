import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Alert, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LoginButton, AppLogo } from '../components';
import FormInput from "../components/FormInput";
import auth from '@react-native-firebase/auth';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import * as firebase from 'firebase';

interface Props {
    navigation: any;
}

const SignUp: React.FC <Props> = (props): JSX.Element => {
    const [phoneValue, setPhoneValue] = useState<string>("");
    const [errorValidation, setErrorValidation] = useState<string>("");

    const recaptchaVerifier = React.useRef(null);
    const [phoneNumber, setPhoneNumber] = React.useState();
    const [verificationId, setVerificationId] = React.useState();
    const [verificationCode, setVerificationCode] = React.useState();
    const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
    const [message, showMessage] = React.useState(
    !firebaseConfig || Platform.OS === 'web'
      ? {
          text:
            'To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.',
        }
      : undefined
  );
    const attemptInvisibleVerification = true;

    const handlePhoneChange = (newText: string) => {
		setPhoneValue(newText);
	};

    const errorValidationSet = (newText: string) => {
		setErrorValidation(newText);
	};

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
                <FormInput label="Phone Number" editable={true} value={phoneValue} onChangeHandler={handlePhoneChange} />


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