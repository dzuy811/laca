import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform,KeyboardAvoidingView } from 'react-native';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import * as firebase from 'firebase';
import { LoginButton, AppLogo } from '../components';
import FormInput from "../components/FormInput";

interface Props {
    navigation: any;
}

const PhoneAuth: React.FC <Props> = (props): JSX.Element => {
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
      <Text style={styles.text}>
          Let's start your journey from here with us!
      </Text>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={attemptInvisibleVerification}
      />
      <KeyboardAvoidingView
        style={styles.containerForm}
        behavior={"padding"}
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
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
              ("+84" + phoneNumber.substring(1)),
              recaptchaVerifier.current
            );
            setVerificationId(verificationId);
            showMessage({
              text: 'Verification code has been sent to your phone.',
            });
          // } catch (err) {
          //     showMessage({ text: `Error: ${err.message}`});
          //   }
          }}
      />
      {!verificationId ? (<View></View>) :(
        <>
          <KeyboardAvoidingView
            style={styles.containerForm}
            behavior={"padding"}
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
              showMessage({ text: 'Phone authentication successful 👍' });
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
          <Text style={{ color:"red" }}>
              {message.text.substring(7)}
          </Text>
          </TouchableOpacity>
        ) : (
          undefined
        )}
        <View style={{flexDirection: 'row', marginTop: 20}}>
                <Text style={styles.text}>Already have an account? </Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('login')}>
                    <Text style={styles.textLogin}>Sign in</Text>
                </TouchableOpacity>
            </View>
      {false && attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
    </View>
  );
}

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
    containerSignUp: {
        width: 300,
        padding: 20,
        backgroundColor:'#DFEBF7',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#fff',
        alignItems: 'center',
        marginBottom: 10,
    }
})

export default PhoneAuth;