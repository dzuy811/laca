import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { LoginButton, AppLogo } from '../components';
import FormInput from "../components/FormInput";
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import * as firebase from 'firebase';
import 'firebase/firestore';

interface Props {
    navigation: any;
}

const Login: React.FC <Props> = (props) => {
    function checkUser(phoneNumber: string) {
        // Fetch data of all users in the collection
        fetch('https://asia-east2-laca-59b8c.cloudfunctions.net/api/users')
        .then((response) => response.json())
        .then((json) => {
            let data = json;
            let check = false; // Check if the phone exist
            data.forEach(function(value: object) {
                console.log(value.phoneNumber);
                // Return true if checked the phone number
                if(value.phoneNumber == ("+84" + phoneNumber.substring(1))) 
                    check = true;
            }); 
            // Add user if not
            if(!check) {
                    const user = firebase.auth().currentUser;
                    const user_info = {
                        phoneNumber: "+84" + phoneNumber.substring(1),
                        name: "",
                        gender: "",
                        review: "",
                        urlAvatar: ""
                    }
                    firebase.firestore().collection("users").doc(user?.uid).set(user_info);
                    console.log(user_info);
            }
        })
        .catch((err) => console.error(err));
    }

    const recaptchaVerifier = React.useRef(null);
    const [phoneNumber, setPhoneNumber] = React.useState<string>("");
    const [verificationId, setVerificationId] = React.useState();
    const [verificationCode, setVerificationCode] = React.useState<string>("");
    const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;

    const handlePhoneChange = (newText: string) => {
		setPhoneNumber(newText);
	};

    const handleVerificationCode = (newText: string) => {
		setVerificationCode(newText);
	};
  
    const [message, showMessage] = React.useState(
        !firebaseConfig || Platform.OS === 'web'
            ? { text: 'To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.'}
            : undefined
  );

    return (
        <View style={styles.container}>
            <AppLogo />
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                attemptInvisibleVerification={true}
                firebaseConfig={firebaseConfig}
            />
            <KeyboardAvoidingView
                style={styles.containerForm}
                behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
                <FormInput
                label="Phone Number"
                value={phoneNumber}
                onChangeHandler={handlePhoneChange}
                />            
            </KeyboardAvoidingView>
            <LoginButton 
                title="Send Verification Code" 
                onPress={async () => {
                    try {
                        const phoneProvider = new firebase.auth.PhoneAuthProvider();
                        const verificationId = await phoneProvider.verifyPhoneNumber(
                        ("+84" + phoneNumber.substring(1)), recaptchaVerifier.current);
                        setVerificationId(verificationId);
                        showMessage({
                            text: 'Verification code has been sent to your phone.',
                        });
                        } catch (err) {
                            showMessage({ text: `Error: ${err.message}`});
                        }
                    }}
            />
            {!verificationId ? (<View></View>) :(
                <>
                    <KeyboardAvoidingView
                        style={styles.containerForm}
                        behavior={Platform.OS == "ios" ? "padding" : "height"}
                    >
                        <FormInput
                            label="Verification Code"
                            value={verificationCode}
                            editable={!!verificationId}
                            onChangeHandler={handleVerificationCode}
                        />
                    </KeyboardAvoidingView>
                    <LoginButton 
                        title="Confirm Code"
                        onPress={async () => {
                            try {
                            const credential = firebase.auth.PhoneAuthProvider.credential(
                                verificationId,
                                verificationCode
                            );
                            await firebase.auth().signInWithCredential(credential);
                            await checkUser(phoneNumber);
                            } catch (err) {
                                showMessage({ text: `Error: ${err.message}`, color: 'red' });
                            }
                        }}
                    />
                </>
            )}
        
            {message ? (
                <TouchableOpacity
                    onPress={() => showMessage(undefined)}>
                <Text style={{ color:"blue" }}>
                    {message.text}
                </Text>
                </TouchableOpacity>
            ) : (
                undefined
            )}
            {false && true && <FirebaseRecaptchaBanner />} 
            <Text style={styles.text}>
                ___________________________
            </Text>
        </View>
    )
}

export default Login;

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
    containerForm: {
        width: "100%",
        paddingBottom: 20
    },
    input: {
        height: 26,
        fontSize: 20,
        color: "#000",
        borderBottomWidth: 1,
        borderBottomColor: "#555",
    },
    textLogin: {
        color: "#FFF",
        fontWeight: "normal",
        marginBottom: 15,
        textDecorationLine: 'underline'
    },
})