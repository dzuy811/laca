import React, { FC } from "react";
import { Dimensions, Text, StyleSheet } from "react-native";
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'

const {height, width} = Dimensions.get('screen');

interface Props {
    title: string;
    onPress: () => void;
}

const App: FC <Props> = (props) => {
    return(
        <TouchableOpacity 
        style = {styles.container} 
        onPress={props.onPress}
        >
            <Text style={styles.text}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default App;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#4B8FD2",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        padding: 10, 
        borderRadius: 8
    },
    text: {
        color: "#FFF"
    }
})