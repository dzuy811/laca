import axios from 'axios';
import firebase from 'firebase';
import React, { useEffect, useState } from 'react'
import { Text, View, Image, StyleSheet, useWindowDimensions, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { getData } from '../constants/utility';

const RankingHeader = () => {

    return (
        <View>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '20%' }}>
                    <Text style={styles.textHeading}>Rank</Text>
                </View>
                <View style={{ width: '60%' }}>
                    <Text style={styles.textHeading}>Name</Text>
                </View>
                <View style={{ width: '20%' }}>
                    <Text style={styles.textHeading}>Journey</Text>
                </View>
            </View>
        </View>
    )
}

const FriendRanking = () => {

    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        const userID = firebase.auth().currentUser?.uid
        const url = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/users/${userID}/friendships/leaderboard`
        axios.get(url)
            .then(res => {
                setLeaderboard(res.data.leaderboard);
            })
        console.log(url)

    }, [])


    return (
        <View>
            <RankingHeader />
            {leaderboard ?
                <View>
                    {leaderboard.map((user, index) =>
                        <View key={user.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: '20%' }}>
                                <Text>{index + 1}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
                                <View>
                                    <Image
                                        source={{ uri: user.urlAvatar }}
                                        style={styles.logo}
                                    />
                                </View>
                                <View>
                                    <Text>{user.name}</Text>
                                </View>
                            </View>
                            <View style={{ width: '20%' }}>
                                <Text>{user.journeyCount}</Text>
                            </View>
                        </View>
                    )}
                </View>
                :
                null
            }

        </View>
    )
}


const GlobalRanking = () => {

    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        const url = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/users/details/leaderboard`
        axios.get(url)
            .then(res => {
                setLeaderboard(res.data.leaderboard);
            })
        console.log(url)

    }, [])


    return (
        <View>
            <RankingHeader />
            {leaderboard.map((user, index) => {
                return (
                    <View key={user.id} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                        <View style={{ width: '20%', paddingLeft: 14 }}>
                            <Text style={{}}>{index+1}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%'}}>
                            <View>
                                <Image
                                    source={{ uri: user.urlAvatar }}
                                    style={styles.logo}
                                />
                            </View>
                            <View style={{paddingHorizontal: 10}}>
                                <Text>{user.name}</Text>
                            </View>
                        </View>
                        <View style={{ width: '20%', paddingLeft: 16 }}>
                            <Text>{user.journeyCount}</Text>
                        </View>
                    </View>
                )
            }

            )}
        </View>
    )
}


const renderScene = SceneMap({
    Friend: FriendRanking,
    Global: GlobalRanking,
});


const renderTabBar = (props: any) => {
    const indicatorWidth = 120

    return (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#8DBAE2', width: indicatorWidth, left: (useWindowDimensions().width / 2 - indicatorWidth) / 2 }}
            style={{ elevation: 0, backgroundColor: '#fff', marginTop: Platform.OS ? 50 : 20 }}
            activeColor={'#8DBAE2'}
            inactiveColor={'#8DBAE2'}
        />
    )

}


const RankingScreen = () => {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'Friend', title: 'Friend' },
        { key: 'Global', title: 'Global' },
    ]);

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
            style={{ backgroundColor: '#fff' }}
            sceneContainerStyle={{ paddingTop: 30, paddingHorizontal: 20 }}
        />

    )
}

const styles = StyleSheet.create({
    logo: {
        width: 30,
        height: 30,
        borderRadius: 50
    },
    textHeading: {
        fontWeight: '700'
    }
})

export default RankingScreen