import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Overlay } from 'react-native-elements'

interface imageReviewSectionProps {
    image: string[],
    pickImage: () => void,
    removeImage: (item: string) => void,
    toggleOverlay: () => void,
    pickVideo: () => void,
    pickImageFromLibrary: () => void,
    visible: boolean
}
// type of the react hook set state

const ImageReviewSection:React.FC<imageReviewSectionProps> = ({image, pickImage, removeImage, toggleOverlay, pickVideo, pickImageFromLibrary, visible}) => {
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 55 }}>
        {image.map(i =>
            <View key={i} style={{ marginRight: 10 }}>
                <Image
                    style={{
                        width: 80,
                        height: 80
                    }}
                    source={{ uri: i }}
                />
                <AntDesign onPress={() => removeImage(i)} name="closecircle" size={24} color="#f2f2f2" style={{ position: 'absolute', right: 0 }} />
            </View>


        )}

        {image.length < 3 ?
                <TouchableOpacity onPress={() => toggleOverlay()}>

            <View style={{ backgroundColor: '#efefef', width: 80, height: 80, borderStyle: 'dashed', borderRadius: 1, borderWidth: 1, borderColor: '#d6d6d6', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/photo-camera.png')}
                        style={{ tintColor:'#b6b6b6' ,width: 30, height: 30 }}

                    />
                <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                    <View style={{ width: 300, paddingTop: 10, paddingRight: 20, paddingLeft: 10, paddingBottom: 20 }}>
                        <View style={styles.overlayTextContainer}>
                            <Text style={{ fontWeight: 'bold' }}>Select Image</Text>
                        </View>
                        <View style={styles.overlayTextContainer}>
                            <TouchableOpacity>
                                <Text onPress={() => pickImage()}>Take Photo...</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.overlayTextContainer}>
                            <TouchableOpacity>
                                <Text onPress={() => pickVideo()}>Record Video...</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.overlayTextContainer}>
                            <TouchableOpacity>
                                <Text onPress={() => pickImageFromLibrary()}>Choose from Lirabry...</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Overlay>


            </View>
            </TouchableOpacity>

            :
            <Text>
                You reached limit of 3 photos for 1 review
            </Text>
        }


    </View>
    )
}

export default ImageReviewSection

const styles = StyleSheet.create(
    {
    overlayTextContainer: {
        marginBottom: 20
    }
})