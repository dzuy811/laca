import React, {useEffect, useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Alert } from 'react-native';
import HomeScreen from '../screens/HomeScreen'
import DescriptionTab from '../screens/DescriptionTab';
import * as Location from 'expo-location';
import LoadingHomeScreen from '../screens/LoadingHomeScreen';
import { MapScreen } from '../screens';
import CameraScreen from '../screens/CameraScreen';
import ReviewScreen from "../screens/ReviewScreen";
import PostComment from '../screens/PostCommentScreen';

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
        <Stack.Screen name="Camera screen" component={CameraScreen}/>
        <Stack.Screen name = "ReviewScreen" component={ReviewScreen}/>
        <Stack.Screen name = "ReplyScreen" component ={PostComment}/>
      </Stack.Navigator>

  )}
export default AttractionNavigator;
