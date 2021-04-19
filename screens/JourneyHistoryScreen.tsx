import React from 'react'
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import {Header} from 'react-native-elements'
import JourneyHistoryCard from '../components/profile-screen-components/journey-history-components/JourneyHistoryCard';


const JourneyHistoryScreen:React.FC<any> = (props) => {
    return (
        <View>
            <Header
                leftComponent={
                        <TouchableOpacity onPress={() => props.navigation.goBack()}>
                            <AntDesign name="arrowleft" size={24} color="#fff" />
                        </TouchableOpacity>
                }
                centerComponent={
                        <Text style={{fontSize: 18, color: '#fff'}}>Journey History</Text>
                }
            />
            {/* Journey History card section */}
            <View style={{marginTop: 20}}>
                <View style={{paddingLeft: 25}}>
                    <Text style={{fontSize: 16, color:'#bdbdbd', fontWeight:'700'}}>Completed journey</Text>
                </View>
                <View style={{marginTop: 16}}>
                    {/* Card Component */}
                    <JourneyHistoryCard/>
                </View>
            </View>
            
        </View>        
    )
}

const style = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: '#4B8FD2',
        height: 100,
        alignItems: 'center'
    },
    
})

export default JourneyHistoryScreen