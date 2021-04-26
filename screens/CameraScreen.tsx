import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as firebase from 'firebase'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native'
import { Rating, Button, Overlay } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons'
import ImageReviewSection from '../components/review-screen-components/ImageReviewSection'
import TextBoxReviewSection from '../components/review-screen-components/TextBoxReviewSection'


// Upload to firebase cloudstore function
async function uploadReview(uriArray: string[], rating: number, review: string) {
    console.log("review: ", review)
    console.log("rating:", rating)
    for (let i = 0; i < uriArray.length; i++) {
        let uri = uriArray[i]
        const response = await fetch(uri);
        const blob = await response.blob();

        // split to get the name from the file
        let uriSplitString = uri.split("/")
        let filename = uriSplitString[uriSplitString.length - 1].split('.')[0]
        console.log("name: ", filename)

        // var ref = firebase.storage().ref().child("images/" + filename);
        // await ref.put(blob)
        // ref.getDownloadURL()
        //     .then((url) => {
        //         console.log(url.toString())
        //     })
    }
    

}




const CameraScreen = () => {

    const CameraButton: React.FC = () => {

        return (
            <View>
                <View style={{ backgroundColor: '#dfebf7', width: 160, height: 160, justifyContent: 'center', alignItems: 'center', borderColor: '#2966A3', borderRadius: 160 / 2, borderWidth: 1 }}>

                    <Image
                        source={require('../assets/photo-camera.png')}
                        style={styles.cameraImage}
                    />

                </View>
            </View>

        )
    }


    const [image, setImage] = useState<string[]>([]);
    const [rating, setRating] = useState<number>(0)
    const [review, setReview] = useState<string>("");
    const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    function handleReview(e:string) {
        setReview(e)
        console.log(e)
    }

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const removeImage = (e: string) => {
        let arr = image.filter(item => item != e)
        setImage(arr)
    }

    // launch camera and capture function
    const pickImage = async () => {
        toggleOverlay() // Close overlay
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.cancelled) {
            setImage([...image, result.uri])
        }
    };


    // launch camera and capture function
    const pickVideo = async () => {
        toggleOverlay() // Close overlay
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            aspect: [4, 3],
            quality: 0.8,
            videoMaxDuration: 5,
        });

        if (!result.cancelled) {
            setImage([...image, result.uri])
        }
    };

    const pickImageFromLibrary = async () => {
        toggleOverlay() // Close overlay
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.cancelled) {
            setImage([...image, result.uri])
        }
    };

    return (
        <TouchableWithoutFeedback style={{ height: '100%' }} onPress={Keyboard.dismiss} accessible={false}>

            <SafeAreaView style={{ height: '100%', width: '100%', backgroundColor: '#fff' }}>
                {image.length == 0 ?
                    <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => toggleOverlay()}>
                            <CameraButton />
                        </TouchableOpacity>
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

                    :
                    <View style={{ height: '100%', justifyContent: 'center' }}>
                        <ImageReviewSection
                        pickImage={pickImage}
                        pickVideo={pickVideo}
                        pickImageFromLibrary={pickImageFromLibrary}
                        visible={visible}
                        removeImage={removeImage}
                        image={image}
                        toggleOverlay={toggleOverlay}
                        />

                        <View>
                            <Rating
                                onFinishRating={(ratings) => setRating((ratings))}
                                imageSize={30}

                            />
                        </View>
                        <TextBoxReviewSection handleReview={handleReview}/>
                        <View style={styles.submitContainer}>
                            <Button
                                buttonStyle={styles.submitButton}
                                title="Submit"
                                titleStyle={styles.submitButtonText}
                                onPress={() => uploadReview(image, rating, review)}
                            />
                        </View>


                    </View>

                }


            </SafeAreaView>

        </TouchableWithoutFeedback>
    )
}

export default CameraScreen

const styles = StyleSheet.create({
    cameraImage: {
        width: 60,
        height: 60,
        tintColor: '#2966A3'
    },
    starLottie: {
        width: 50,
        height: 50,
    },
    rating: {
    },
    textArea: {
        height: 200,
        borderRadius: 20,
        borderColor: '#f1f1f1',
        borderWidth: 2,
        backgroundColor: "#fff",
        width: 300,
        padding: 20
    },
    submitContainer: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center'
    },
    submitButton: {
        alignItems: 'center',
        textAlign: 'center',
        paddingVertical: 16,
        paddingHorizontal: 126,
        borderRadius: 50,
        borderColor: '#8DBAE2',
        backgroundColor: '#DFEBF7',
        borderWidth: 1,
    },
    submitButtonText: {
        color: '#4B8FD2',
        fontSize: 16,
        fontWeight: '300'
    },
    overlayTextContainer: {
        marginBottom: 20
    }
})