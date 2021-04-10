import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { LoginButton, RoundedImage, AppLogo } from '../components';
import FormInput from "../components/FormInput";

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

    const [name, setName] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    const [textValue, setTextValue] = useState<string>("");
	const [passwordValue, setPasswordValue] = useState<string>("");

    const handleTextChange = (newText: string) => {
		setTextValue(newText);
	};

	const handlePasswordChange = (newPassword: string) => {
		setPasswordValue(newPassword);
	};

    return (
        <View style={styles.container}>
            <AppLogo />
            <KeyboardAvoidingView
                style={styles.containerForm}
                behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
                <FormInput label="Username" value={textValue} onChangeHandler={handleTextChange} />
                <FormInput
                    isSecured={true}
                    label="Password"
                    value={passwordValue}
                    onChangeHandler={handlePasswordChange}
                />
            </KeyboardAvoidingView>
            <LoginButton title="LOGIN" onPress={() => alert("LOGIN")} /> 
            <FlatList style={{flexGrow: 0}}
                data={socialMedia}
                numColumns={2}
                renderItem={({ item }) => 
                    <View style={(item.id==1)?{ width: 100 }:{}}>
                    <RoundedImage 
                        title={item.title} 
                        onPress={() => (item.title == "FB" ? alert("Facebook") : alert("Google"))} />
                    </View>
                }
                keyExtractor={(item) => item.id.toString()}
            />
            <Text style={styles.text}>
                ___________________________
            </Text>
            <Text style={styles.text}>
                Don’t have an account?
            </Text>
            <LoginButton title="SIGN UP" onPress={() => props.navigation.navigate('signUp')} />
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
        paddingBottom: 50
    },
    input: {
        height: 26,
        fontSize: 20,
        color: "#000",
        borderBottomWidth: 1,
        borderBottomColor: "#555",
    },
})
