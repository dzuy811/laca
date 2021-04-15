import React from 'react'
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import {Header} from 'react-native-elements'


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
            <View>
                <Text>Completed journey</Text>
            </View>
            <View>
                {/* Card Component */}
                <View>
                    <View>
                        <Text>12 March 2021</Text>
                    </View>
                    <View>
                        <Text>Nhà Thờ Đức Bà</Text>
                    </View>
                    <View>
                        <Text>0.7km</Text>
                        <Text>-</Text>
                        <Text>69 Đồng Khởi</Text>
                    </View>
                    <View>
                        <FontAwesome5 style={{marginRight: 2}} name="coins" size={24} color="#E2D0A2" />
                        <Text style={{marginLeft: 2, fontSize: 18}} >400</Text>
                    </View>
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