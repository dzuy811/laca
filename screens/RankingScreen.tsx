import React from 'react'
import { Text, View, Image, StyleSheet, useWindowDimensions, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const RankingHeader = () => {

return (
    <View>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '20%' }}>
                    <Text>Rank</Text>
                </View>
                <View style={{ width: '60%' }}>
                    <Text>Name</Text>
                </View>
                <View style={{ width: '20%' }}>
                    <Text>Journey</Text>
                </View>
            </View>
        </View>
)}

const cityRanking = () => {
    return (
        <View>
            <RankingHeader/>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: '20%' }}>
                    <Text>1</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
                    <View>
                        <Image
                            source={{ uri: "https://www.pinclipart.com/picdir/middle/577-5772540_ears-clipart-monkey-monkey-avatar-png-transparent-png.png" }}
                            style={styles.logo}
                        />
                    </View>
                    <View>
                        <Text>Hung Nguyen</Text>
                    </View>
                </View>
                <View style={{ width: '20%' }}>
                    <Text>10</Text>
                </View>
            </View>
        </View>
    )
}


const nationalRanking = () => {
    return (
        <View>
            <RankingHeader/>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: '20%' }}>
                    <Text>2</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '60%' }}>
                    <View>
                        <Image
                            source={{ uri: "https://www.pinclipart.com/picdir/middle/577-5772540_ears-clipart-monkey-monkey-avatar-png-transparent-png.png" }}
                            style={styles.logo}
                        />
                    </View>
                    <View>
                        <Text>Hung Nguyen</Text>
                    </View>
                </View>
                <View style={{ width: '20%' }}>
                    <Text>10</Text>
                </View>
            </View>
        </View>
    )
}


const renderScene = SceneMap({
    City: cityRanking,
    National: nationalRanking,
  });


const renderTabBar = (props: any) => {
    const indicatorWidth = 120

    return (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#8DBAE2', width: indicatorWidth, left: (useWindowDimensions().width / 2 - indicatorWidth) / 2 }}
            style={{elevation:0, backgroundColor: '#fff', marginTop: Platform.OS? 50:20}}
            activeColor={'#8DBAE2'}
            inactiveColor={'#8DBAE2'}
        />
    )

}
  

const RankingScreen = () => {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'City', title: 'City' },
      { key: 'National', title: 'National' },
    ]);

    return (
            <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
            style={{backgroundColor: '#fff'}}
            sceneContainerStyle={{paddingTop: 30, paddingHorizontal: 20}}
            />

    )
}

const styles = StyleSheet.create({
    logo: {
        width: 30,
        height: 30,
        borderRadius: 50
      },
})

export default RankingScreen