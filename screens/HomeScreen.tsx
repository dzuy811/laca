import React, { Component } from 'react'
import { StyleSheet, Text, View} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import AttractionList from '../components/AttractionList'

const data = [
    {
        id: '1',
        name: 'Nha Tho Duc Ba',
        reward: 100,
        ratings: 3.5
    },
    {
        id: '2',
        name: 'Dai Hoc RMIT',
        reward: 200,
        ratings: 4.8
    },
    {
        id: '3',
        name: 'Bao Tang Ho Chi Minh',
        reward: 240,
        ratings: 4.1
    }
]


type homeScreenProps = {
    
}

type attractionData = {
    name: string,
    reward: number,
    review: number,

}

export class HomeScreen extends Component<homeScreenProps, attractionData> {

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#FCFCFC'}}>
                <SafeAreaView style={style.header}>
                    <View>
                        <Text>702 Nguyen Van Linh</Text>
                    </View>
                </SafeAreaView>
                <AttractionList attraction={data}/>
            </View>
        )
    }
}

const style = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: '#4B8FD2',
        height: 100,
        alignItems: 'center'
    },
    sectionHeading: {
        color: '#4B8FD2'
    }
})

export default HomeScreen
