// import React, {memo, useEffect, useRef, useState} from 'react';
// import {ActivityIndicator, StyleSheet, Text} from 'react-native';
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from 'react-native-reanimated';
// import {uiSelectors, useStore} from '../../store';
// import {COLORS, FONTS, SIZES} from '../../constants/theme';
// import {useInterval} from '../../hooks';

// export const GlobalLoading = memo(({}) => {
//   const globalLoading = useStore(uiSelectors.globalLoading);
//   const showGlobaloadingValueInstantly = useStore(
//     uiSelectors.showGlobaloadingValueInstantly,
//   );
//   const [showUI, setShowUI] = useState(false);

//   const loadingStartTime = useRef(0);
//   const opacity = useSharedValue(0);

//   useInterval(() => {
//     if (Date.now() - loadingStartTime.current >= 2000) {
//       setShowUI(true);
//     }
//   }, 1000);

//   useEffect(() => {
//     if (globalLoading) {
//       loadingStartTime.current = Date.now();
//       setShowUI(false);
//       opacity.value = withTiming(1);
//     } else {
//       opacity.value = withTiming(0);
//     }
//   }, [globalLoading]);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       opacity: opacity.value,
//       top: opacity.value === 0 ? SIZES.height : 0,
//     };
//   });

//   return (
//     <Animated.View
//       style={[
//         {
//           ...StyleSheet.absoluteFillObject,
//           backgroundColor: COLORS.white,
//           justifyContent: 'center',
//           alignItems: 'center',
//         },
//         animatedStyle,
//       ]}>
//       {(showUI || showGlobaloadingValueInstantly) && (
//         <>
//           <ActivityIndicator
//             size="large"
//             color={COLORS.primary}
//             style={{
//               borderRadius: 100,
//               padding: SIZES.padding,
//               backgroundColor: COLORS.white,
//             }}
//           />
//           {typeof globalLoading === 'string' && (
//             <Text
//               style={{
//                 ...FONTS.body4,
//                 color: COLORS.secondary,
//                 paddingTop: SIZES.padding,
//               }}>
//               {globalLoading}
//             </Text>
//           )}
//         </>
//       )}
//     </Animated.View>
//   );
// });
