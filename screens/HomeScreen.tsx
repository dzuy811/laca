import React, { Component } from 'react'
import { StyleSheet, Text, View} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import AttractionCard from '../components/AttractionCard'

type homeScreenProps = {}

export class HomeScreen extends Component<homeScreenProps> {

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#FCFCFC'}}>
                <SafeAreaView style={style.header}>
                    <View>
                        <Text>702 Nguyen Van Linh</Text>
                    </View>
                </SafeAreaView>
                <View>
                    <View>
                        <Text>Local Attractions</Text>
                    </View>
                    <AttractionCard/>
                </View>
                
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
    }
})

export default HomeScreen
