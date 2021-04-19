import React, { useEffect } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5, AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
	animatedValue: any;
	navigation?: any;
	headerName: string;
}

const HEADER_HEIGHT = 150;
const AnimatedHeader = ({ animatedValue, navigation, headerName }: Props) => {
	const insets = useSafeAreaInsets();

	const headerHeight = animatedValue.interpolate({
		inputRange: [0, HEADER_HEIGHT + insets.top],
		outputRange: [HEADER_HEIGHT + insets.top, insets.top + 44],
		extrapolate: "clamp",
	});

	const textPlaceMargin = animatedValue.interpolate({
		inputRange: [0, HEADER_HEIGHT + insets.top],
		outputRange: [60, 25],
		extrapolate: "clamp",
	});

	const textAddressMargin = animatedValue.interpolate({
		inputRange: [0, HEADER_HEIGHT + insets.top],
		outputRange: [5, 20],
	});

	return (
		<View style={{ backgroundColor: "white" }}>
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
				<Animated.View style={{ flexDirection: "row", flexWrap: "wrap" }}>
					{/* Left Arrow icon container */}
					<TouchableOpacity
						style={{
							paddingTop: 30,
							paddingLeft: 30,
						}}
						onPress={() => {
							navigation.navigate("Home");
						}}
					>
						<AntDesign name="arrowleft" size={24} color="white" />
					</TouchableOpacity>

					{/* Text container */}
					<Animated.View
						style={{
							paddingTop: textPlaceMargin,
							justifyContent: "center",
							alignItems: "center",
							marginLeft: 53,
						}}
					>
						<Text style={{ color: "#fff", fontSize: 24 }}>{headerName}</Text>
					</Animated.View>

					{/* Info icon container*/}
					<TouchableOpacity
						style={{
							paddingTop: 30,
							paddingLeft: 58,
						}}
					>
						<AntDesign name="infocirlceo" size={24} color="white" />
					</TouchableOpacity>
					{/* Address - Distance container */}
					<Animated.View
						style={{
							marginTop: textAddressMargin,
							marginLeft: 108,
						}}
					>
						<Animated.Text
							style={{
								fontSize: 12,
								color: "#BED8EE",
								fontWeight: "400",
							}}
						>
							6.9km, 01 Nguyễn Tất Thành, Quận 4
						</Animated.Text>
					</Animated.View>
				</Animated.View>
			</Animated.View>
		</View>
	);
};

export default AnimatedHeader;
