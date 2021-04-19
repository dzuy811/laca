import React, {useEffect, useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Alert } from 'react-native';
import HomeScreen from '../screens/HomeScreen'
import DescriptionTab from '../screens/DescriptionTab';
import * as Location from 'expo-location';
import LoadingHomeScreen from '../screens/LoadingHomeScreen';
import { MapScreen } from '../screens';

const Stack = createStackNavigator();

type props = {
  navigation: any;
}

const AttractionNavigator:React.FC<props> = ({navigation}) => {


  return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen
          name="Home"
          children={ () =>
            <HomeScreen navigation={navigation} />
          }
        />
        <Stack.Screen name="Attraction detail" component={DescriptionTab}/>
        <Stack.Screen name="Journey Map" component={MapScreen} />
      </Stack.Navigator>

  )}
export default AttractionNavigator;
