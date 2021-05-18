import axios from 'axios';
import firebase from 'firebase';
import React, { useEffect, useState } from 'react'
import { Text, View, Image, StyleSheet, useWindowDimensions, Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
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

    const navigation = useNavigation();
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        const userID = firebase.auth().currentUser?.uid
        const url = process.env.API_BACKEND + `/users/${userID}/friendships/leaderboard`
        axios.get(url)
            .then(res => {
                setLeaderboard(res.data.leaderboard);
            })
        console.log(url)

    }, [])


    return (
        <View>
            {leaderboard ?
                <View>
                    {leaderboard.map((user, index) =>
                               <View key={user.id} style={{ flexDirection: 'row', alignItems: 'center',height: 80, width: '100%'}}>
                               <View style={styles.rankingNumberBox}>
                                   {index == 0 ?
                                       <Image
                                           source={require('../assets/gold-medal.png')}
                                           style={styles.logo}
                                       />
                                       :
                                       <>
                                           {index == 1 ?
                                               <Image
                                                   source={require('../assets/silver-medal.png')}
                                                   style={styles.logo}
                                               />
                                               :
                                               <>
                                                   {index == 2 ?
                                                       <Image
                                                           source={require('../assets/bronze-medal.png')}
                                                           style={styles.logo}
                                                       />
                                                       :
                                                       <Text style={styles.rankingNumberText}>{index + 1}</Text>
       
                                                   }
                                               </>
                                           }
                                       </>
                                   }
                               </View>
                            {user.id == firebase.auth().currentUser?.uid?
                            <View style={styles.rankingNameBox}>
                            <View>
                                <Image
                                    source={{ uri: user.urlAvatar }}
                                    style={styles.logo}
                                />
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.userName}>{user.name}</Text>
                            </View>
                        </View>
                        : 
                        <TouchableOpacity
                        onPress={() => navigation.navigate('Friend Profile', {data: user})}
                        >
                            <View style={styles.rankingNameBox}>
                                <View>
                                    <Image
                                        source={{ uri: user.urlAvatar }}
                                        style={styles.logo}
                                    />
                                </View>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.userName}>{user.name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                            
                            }
                              
                               <View style={styles.rankingJourneyBox}>
                                   <Image
                                       source={require('../assets/sneakers.png')}
                                   />
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
    const navigation = useNavigation();

    function checkFriend(id: string, userData: any) {
        const userID = firebase.auth().currentUser?.uid
        if (id == userID) {
            return null;
        }
        let friendshipURL = `https://asia-east2-laca-59b8c.cloudfunctions.net/api/friendships/get?userID=${userID}&otherUserID=${id}`
        fetch(friendshipURL)
        .then(message => message.json())
        .then(data => {
            if (data.id == undefined) {
                navigation.navigate('User Profile', {data: userData}) 
            } else {
                navigation.navigate('Friend Profile', {data: userData})
            }
        })
    }

    useEffect(() => {
        const url = process.env.API_BACKEND + `/users/details/leaderboard`
        axios.get(url)
            .then(res => {
                setLeaderboard(res.data.leaderboard);
            })
        console.log(url)

    }, [])


    return (
        <View>
            {/* <RankingHeader /> */}
            {leaderboard.map((user, index) => {
                
                return (
                    <View key={user.id} style={{ flexDirection: 'row', alignItems: 'center',height: 80, width: '100%'}}>
                        <View style={styles.rankingNumberBox}>
                            {index == 0 ?
                                <Image
                                    source={require('../assets/gold-medal.png')}
                                    style={styles.logo}
                                />
                                :
                                <>
                                    {index == 1 ?
                                        <Image
                                            source={require('../assets/silver-medal.png')}
                                            style={styles.logo}
                                        />
                                        :
                                        <>
                                            {index == 2 ?
                                                <Image
                                                    source={require('../assets/bronze-medal.png')}
                                                    style={styles.logo}
                                                />
                                                :
                                                <Text style={styles.rankingNumberText}>{index + 1}</Text>

                                            }
                                        </>
                                    }
                                </>
                            }
                        </View>
                    {user.id == firebase.auth().currentUser.uid?
                            <View style={styles.rankingNameBox}>
                                <View>
                                    <Image
                                        source={{ uri: user.urlAvatar }}
                                        style={styles.logo}
                                    />
                                </View>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.userName}>{user.name}</Text>
                                </View>
                            </View>
                        :
                        <TouchableOpacity
                        onPress={() => checkFriend(user.id, user)}
                        >
                            <View style={styles.rankingNameBox}>
                                <View>
                                    <Image
                                        source={{ uri: user.urlAvatar }}
                                        style={styles.logo}
                                    />
                                </View>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.userName}>{user.name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                        
                        <View style={styles.rankingJourneyBox}>
                            <Image
                                source={require('../assets/sneakers.png')}
                            />
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
        width: 40,
        height: 40,
        borderRadius: 50
    },
    textHeading: {
        fontWeight: '700'
    },

    rankingNumberBox: {
        height: '70%',
        width: '15%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankingNumberText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold'
    },
    rankingNameBox: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        width: '85%',
    },
    rankingJourneyBox: { 
        alignItems: 'center',
        width: '10%',
        position: 'absolute',
        right: 0
    },
    userName: {
        fontWeight: '600',
        fontSize: 16
    }
})

export default RankingScreen