import React, { Component } from 'react'
import { StyleSheet, Text, View} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import AttractionList from '../components/AttractionList'

// const data = [
//     {
//         id: '1',
//         name: 'Nha Tho Duc Ba',
//         reward: 100,
//         ratings: 3.5
//     },
//     {
//         id: '2',
//         name: 'Dai Hoc RMIT',
//         reward: 200,
//         ratings: 4.8
//     },
//     {
//         id: '3',
//         name: 'Bao Tang Ho Chi Minh',
//         reward: 240,
//         ratings: 4.1
//     }
// ]


type homeScreenProps = {
    data: any[],
}

export class HomeScreen extends Component<homeScreenProps> {

    state: homeScreenProps = {
        data: []
    }

    componentDidMount() {
        fetch('http://localhost:5001/laca-59b8c/us-central1/api/attractions')
        .then((response) => response.json())
        .then((json) => {
            this.setState({ data: json})
            console.log(this.state.data)
        })
        .catch((err) => console.error(err))
    }

    render() {
        const data = this.state;
        return (
            <View style={{flex: 1, backgroundColor: '#FCFCFC'}}>
                <SafeAreaView style={style.header}>
                    <View>
                        <Text>702 Nguyen Van Linh</Text>
                    </View>
                </SafeAreaView>
                <View style={{marginLeft: 20, marginTop: 20}}>
                    <AttractionList attractions={this.state.data}/>
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
    },
    sectionHeading: {
        color: '#4B8FD2'
    }
})

export default HomeScreen
