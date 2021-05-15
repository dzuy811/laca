import React, { useEffect } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
	animatedValue: any;
	navigation?: any;
	headerName: string;
	headerDistance: number;
}

const HEADER_HEIGHT = 150;
const AnimatedHeader = ({ animatedValue, navigation, headerName, headerDistance }: Props) => {
	const insets = useSafeAreaInsets();


	const headerHeight = animatedValue.interpolate({
		inputRange: [0, HEADER_HEIGHT + insets.top],
		outputRange: [HEADER_HEIGHT + insets.top, insets.top + 45],
		extrapolate: "clamp",
	});


	// useEffect(() => {
	// 	for (var key in headerHeight) {
	// 		var value = headerHeight[key]
	// 		console.log(value)
	// 	}
	// },[headerHeight]);

	const iconPadding = animatedValue.interpolate({
		inputRange: [10, HEADER_HEIGHT + insets.top],
		outputRange: [50, insets.top],
		extrapolate: "clamp",
	});

	const textPlaceMargin = animatedValue.interpolate({
		inputRange: [0, HEADER_HEIGHT + insets.top],
		outputRange: [60, headerHeight["_config"]['outputRange'][1]/2],
		extrapolate: "clamp",
	});

	const textAddressMargin = animatedValue.interpolate({
		inputRange: [0, HEADER_HEIGHT + insets.top],
		outputRange: [5, 50],
	});

	return (
		<View style={{ backgroundColor: "white"}}>
			<Animated.View
				style={{
					position: "relative",
					top: 0,
					left: 0,
					right: 0,
					zIndex: 10,
					height: headerHeight,
					backgroundColor: "#4B8FD2",
					borderBottomLeftRadius: HEADER_HEIGHT / 3.5,
					borderBottomRightRadius: HEADER_HEIGHT / 3.5,
				}}
			>
				{/* Container for all elements inside header */}
				<Animated.View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-evenly' }}>
					{/* Left Arrow icon container */}
					<TouchableOpacity
						style={{
							paddingTop: headerHeight["_config"]['outputRange'][1]/2,
							paddingBottom: headerHeight["_config"]['outputRange'][1]/2,

						}}
						onPress={() => {
							navigation.goBack();
						}}
					>
						<AntDesign name="arrowleft" size={24} color="white" />
					</TouchableOpacity>

					{/* Text container */}
					<Animated.View style={{}}>
						<Animated.View
							style={{
								paddingTop: textPlaceMargin,
								alignSelf:'center'
							}}
						>
							<Text style={{ color: "#fff", fontSize: 24, }}>{headerName}</Text>
						</Animated.View>
						<Animated.View
						style={{
							marginTop: textAddressMargin,
							
						}}
					>
						<Animated.Text
							style={{
								fontSize: 12,
								color: "#BED8EE",
								fontWeight: "400",
							}}
						>
							{headerDistance.toFixed(1)}km, 01 Nguyễn Tất Thành, Quận 4
						</Animated.Text>
					</Animated.View>
					</Animated.View>
					

					{/* Info icon container*/}
					<TouchableOpacity
						style={{
							paddingTop: headerHeight["_config"]['outputRange'][1]/2,
						}}
					>
						<AntDesign name="infocirlceo" size={24} color="white" />
					</TouchableOpacity>
					{/* Address - Distance container */}
					
				</Animated.View>
			</Animated.View>
		</View>
	);
};

export default AnimatedHeader;
