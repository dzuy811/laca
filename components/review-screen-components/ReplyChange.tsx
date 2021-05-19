import React from 'react'
import { Text, View, TextInput, StyleSheet, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import LoginButton from '../LoginButton'


type inputprop = {handleReview:any,word:string,submitFunc:any}

const ReplyChange = ({handleReview,word,submitFunc} :inputprop) => {
    return (
        <View style={{ alignItems: 'center' }}>
            <Text style = {styles.titleArea}>
                Edit your reply here
            </Text>
                <TextInput
                    style={styles.textArea}
                    underlineColorAndroid="transparent"
                    placeholder={`${word}`}
                    placeholderTextColor={"#9E9E9E"}
                    numberOfLines={10}
                    multiline={true}
                    onChangeText={reviews => handleReview(reviews)}
                />

                <LoginButton 
                title="submit "
                onPress={() => submitFunc()}
                color="#4B8FD2"
                textColor="#E2D0A2"/>

                           
        </View>
    )
}

export default ReplyChange

const styles = StyleSheet.create({
    textArea: {
        height: 100,
        borderRadius: 20,
        borderColor: '#f1f1f1',
        borderWidth: 2,
        backgroundColor: "#fff",
        width: 300,
        padding: 20
    },
    titleArea: {
        fontSize:20,
        fontWeight:"bold",
        paddingBottom:4,
        // fontColor: "4B8FD2"
        color :"#4B8FD2"
    }
})