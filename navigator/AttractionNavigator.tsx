import React, {useEffect, useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen'
import DescriptionTab from '../screens/DescriptionTab';
import { MapScreen } from '../screens';
import CameraScreen from '../screens/CameraScreen';
import ReviewScreen from "../screens/ReviewScreen";

const Stack = createStackNavigator();

type props = {
  navigation: any;
}

const AttractionNavigator:React.FC<props> = ({address}) => {
  console.log("attrction navigator props: ", address);
  

  return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen
          name="Home"
          children={ () => <HomeScreen address={address} />}
        />
        <Stack.Screen name="Attraction detail" component={DescriptionTab}/>
        <Stack.Screen name="Journey Map" component={MapScreen} />
        <Stack.Screen name="Camera screen" component={CameraScreen}/>
        <Stack.Screen name = "ReviewScreen" component={ReviewScreen}/>
      </Stack.Navigator>

  )}
export default AttractionNavigator;
