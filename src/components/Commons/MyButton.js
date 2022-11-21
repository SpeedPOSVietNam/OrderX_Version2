import React, {memo, useCallback, useMemo} from 'react';
import {COLORS, SIZES} from '../../constants/theme';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {vibrate} from '../../helpers/utils';

export const MyButton = memo(
  ({
    disable,
    disabled = false,
    vibrateOnPress = false,

    // icon left/top
    icon,
    iconSize = 28,
    iconStyle,

    // icon right/bottom
    iconRight,
    iconRightSize = 28,
    iconRightStyle,

    // title
    title,
    titleStyle,

    // badge
    badge = 0,
    badgeColor = 'red',
    badgeTextColor = 'white',
    maxBadge = 9,
    badgeNearIcon = false,

    // loading
    loading = false,
    loadingSize = 30,
    loadingColor = COLORS.white,

    // style
    vertical = false,

    // other
    onPressIn,
    onPressOut,
    onPress,
    onLongPress,
    containerStyle,
    delayLongPress = 500,
  }) => {
    const badgeValue = badge > maxBadge ? `${maxBadge}+` : badge;

    const renderLoadingState = useCallback(
      () => <ActivityIndicator color={loadingColor} size={loadingSize} />,
      [loadingColor, loadingSize],
    );

    const renderBadge = useCallback(
      () =>
        badge !== 0 && (
          <Badge
            value={badgeValue}
            offset={badgeNearIcon ? -iconSize / 2 : -4}
            textStyle={{color: badgeTextColor}}
            containerStyle={{backgroundColor: badgeColor}}
          />
        ),
      [badge, badgeColor, badgeNearIcon, badgeTextColor, badgeValue, iconSize],
    );

    const renderNormalState = useCallback(
      () => (
        <>
          {icon && (
            <View>
              <Image
                resizeMode="contain"
                source={icon}
                style={[
                  {width: iconSize, height: iconSize, ...iconStyle},
                  disabled ? {tintColor: COLORS.lightGray3} : {},
                ]}
              />
              {badgeNearIcon && renderBadge()}
            </View>
          )}
          {title && <Text style={titleStyle}>{title}</Text>}
          {!badgeNearIcon && renderBadge()}
          {iconRight && (
            <Image
              resizeMode="contain"
              source={iconRight}
              style={{
                width: iconRightSize,
                height: iconRightSize,
                ...iconRightStyle,
              }}
            />
          )}
        </>
      ),
      [
        badgeNearIcon,
        disabled,
        icon,
        iconRight,
        iconRightSize,
        iconRightStyle,
        iconSize,
        iconStyle,
        renderBadge,
        title,
        titleStyle,
      ],
    );

    const handleOnPress = useMemo(
      () =>
        loading || disabled
          ? () => {}
          : vibrateOnPress
          ? () => {
              vibrate(60);
              onPress();
            }
          : onPress,
      [disabled, loading, onPress, vibrateOnPress],
    );

    const handleLongPress = useCallback(
      () => (loading || disabled ? () => {} : onLongPress),
      [disabled, loading, onLongPress],
    );

    // return (
    //     <TouchableOpacity
    //         onPressIn={onPressIn}
    //         onPressOut={onPressOut}
    //         delayLongPress={delayLongPress}
    //         onLongPress={loading || disabled ? () => {} : onLongPress}
    //         onPress={loading || disabled ? () => {} : onPress}
    //         style={{
    //             flexDirection: vertical ? 'column' : 'row',
    //             justifyContent: !icon && !iconRight ? 'center' : 'flex-start', // nếu ko có icon thì align center text
    //             alignItems: 'center',
    //             padding: SIZES.padding,
    //             ...containerStyle,
    //         }}>
    //         {loading ? renderLoadingState() : renderNormalState()}
    //     </TouchableOpacity>
    // );

    return (
      <TouchableNativeFeedback
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        delayLongPress={delayLongPress}
        onLongPress={handleLongPress}
        onPress={handleOnPress}
        disabled={disable}>
        <View
          style={{
            flexDirection: vertical ? 'column' : 'row',
            justifyContent: !icon && !iconRight ? 'center' : 'flex-start', // nếu ko có icon thì align center text
            alignItems: 'center',
            padding: SIZES.padding,
            ...containerStyle,
          }}>
          {loading ? renderLoadingState() : renderNormalState()}
        </View>
      </TouchableNativeFeedback>
    );
  },
);

const Badge = memo(
  ({
    value,
    offset = -6,
    offsetY = offset,
    offsetX = offset,
    textStyle,
    containerStyle,
  }) => {
    let showValue = typeof value === 'string' || typeof value === 'number';
    let dotSize = showValue ? 20 : 10;
    return (
      <View
        style={{
          backgroundColor: COLORS.danger,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: showValue ? offsetY : 0, // offset only effect if showValue is true
          right: showValue ? offsetX : 0,
          borderRadius: dotSize / 2,
          minWidth: dotSize,
          height: dotSize,
          ...containerStyle,
        }}>
        <Text style={{color: COLORS.white, ...textStyle}}>
          {showValue ? value : ''}
        </Text>
      </View>
    );
  },
);
