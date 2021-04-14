import React from 'react'
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome5, AntDesign } from '@expo/vector-icons';


const JourneyHistoryHeader: React.FC<any> = ({navigation}) => {
    return (
        <View style={style.header}>
        <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text> BACK </Text>
            </TouchableOpacity>
        </View>
        <View style={{flex: 1, marginTop:'7%', justifyContent:'center' ,alignItems: 'center'}}>
            <Text style={{justifyContent: 'center', fontSize: 18, color: '#fff'}}>Journey History</Text>
        </View>
        </View>
    )
}

const JourneyHistoryScreen:React.FC<any> = (props) => {
    return (
        <View>
            <JourneyHistoryHeader navigation={props.navigation}/>
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