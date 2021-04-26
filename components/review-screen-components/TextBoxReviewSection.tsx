import React from 'react'
import { Text, View, TextInput, StyleSheet } from 'react-native'

const TextBoxReviewSection = ({handleReview}) => {
    return (
        <View style={{ alignItems: 'center' }}>
                            <TextInput
                                style={styles.textArea}
                                underlineColorAndroid="transparent"
                                placeholder={"Leave your review about the attraction..."}
                                placeholderTextColor={"#9E9E9E"}
                                numberOfLines={10}
                                multiline={true}
                                onChangeText={reviews => handleReview(reviews)}
                            />
        </View>
    )
}

export default TextBoxReviewSection

const styles = StyleSheet.create({
    textArea: {
        height: 200,
        borderRadius: 20,
        borderColor: '#f1f1f1',
        borderWidth: 2,
        backgroundColor: "#fff",
        width: 300,
        padding: 20
    },
})