import React from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HEADER_HEIGHT = 200;



const AnimatedHeader = ( {animatedValue} : any ) => {
  const insets = useSafeAreaInsets();

  const headerHeight = animatedValue.interpolate({
    inputRange: [0, HEADER_HEIGHT + insets.top],
    outputRange: [HEADER_HEIGHT + insets.top, insets.top + 44],
    // extrapolate: 'clamp'
  });

  return (
    <Animated.View
      style={{
        position: 'relative',
        height: headerHeight,
        backgroundColor: '#4B8FD2'
      }}
    />
  );
};

export default AnimatedHeader;