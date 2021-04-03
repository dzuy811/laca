import React, { FC } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { LoginButton, RoundedImage, AppLogo } from '../components';

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

const App: FC = (props) => {
    return (
        
        <View style={styles.container}>
            <AppLogo />
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
            <LoginButton title="SIGN UP" onPress={() => props.navigation.navigate('signup')} />
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
    }
})