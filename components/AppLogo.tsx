import React, { FC } from "react";
import { StyleSheet, Image } from "react-native";
import { TouchableHighlight } from 'react-native-gesture-handler';

const app_logo = require('../assets/app_logo.png');

const App: FC = () => {
    return(
        <TouchableHighlight 
        activeOpacity = {0.6}
        style = {styles.imgContainer} 
        >
            <Image
                style={styles.image}
                source={app_logo}
                resizeMode={"cover"} // <- needs to be "cover" for borderRadius to take effect on Android
            />
        </TouchableHighlight>
    )
}

export default App;

const styles = StyleSheet.create({
    imgContainer: {
        marginLeft: 8,
        height: 170,
        width: 170,
        borderRadius: 100,
        borderWidth: 1,
        shadowOpacity: 1,
        borderColor: "transparent",
        marginBottom: 35,
    },
    image: {
        height: 167,
        width: 167,
        backgroundColor: "#FFF",
        borderRadius: 100,
  },
})