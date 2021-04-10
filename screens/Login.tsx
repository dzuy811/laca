import React, { useState } from "react";
import { Alert, View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { LoginButton, RoundedImage, AppLogo } from '../components';
import FormInput from "../components/FormInput";
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import * as firebase from 'firebase';

interface Props {
    navigation: any;
}

const Login: React.FC <Props> = (props) => {
    const socialMedia = [
        {
            id: 1,
            title: "FB"
        },
        {
            id: 2,
            title: "GG"
        }
    ];
    
    const [emailValue, setTextValue] = useState<string>("");
	const [passwordValue, setPasswordValue] = useState<string>("");

    const handleTextChange = (newText: string) => {
		setTextValue(newText);
	};

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

  const attemptInvisibleVerification = true;

    return (
        <View style={styles.container}>
            <AppLogo />
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
                attemptInvisibleVerification={attemptInvisibleVerification}
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
                        title="Send Verification Code"
                        onPress={async () => {
                            try {
                            const credential = firebase.auth.PhoneAuthProvider.credential(
                                verificationId,
                                verificationCode
                            );
                            await firebase.auth().signInWithCredential(credential);
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
            {false && attemptInvisibleVerification && <FirebaseRecaptchaBanner />} 
            <FlatList style={{flexGrow: 0}}
                data={socialMedia}
                numColumns={2}
                renderItem={({ item }) => 
                    <View style={(item.id==1)?{ width: 100 }:{}}>
                    <RoundedImage 
                        title={item.title} 
                        onPress={() => (item.title == "FB" ? alert("FB") : alert("GG"))} />
                    </View>
                }
                keyExtractor={(item) => item.id.toString()}
            />
            <Text style={styles.text}>
                ___________________________
            </Text>
            <View style={{flexDirection: 'row', marginTop: 20}}>
                <Text style={styles.text}>
                    Don’t have an account?
                </Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('phoneAuth')}>
                        <Text style={styles.textLogin}> Sign up</Text>
                </TouchableOpacity> 
            </View>
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