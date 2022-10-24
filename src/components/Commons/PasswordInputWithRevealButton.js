import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  setGlobalLoading,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../constants/theme';
import {MyButton} from './MyButton';
import icons from '../../constants/icons';

export const PasswordInputWithRevealButton = ({
  value,
  onChangeText,
  textHolder,
  ImageSrc,
  ...props
}) => {
  const [isReveal, setReveal] = useState(false);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TextInput
        secureTextEntry={!isReveal}
        value={value}
        placeholder={textHolder}
        onChangeText={onChangeText}
        style={{
          ...FONTS.body3,
          color: COLORS.black,
          textAlign: 'center',
          borderRadius: SIZES.radius,
          borderColor: COLORS.title,
          borderWidth: SIZES.border,
          backgroundColor: COLORS.white,
          width: '85%',
          margin: SIZES.padding,
          padding: SIZES.padding,
        }}
        {...props}
      />
      <MyButton
        containerStyle={{position: 'absolute', right: SIZES.padding}}
        icon={isReveal ? icons.eye_close : icons.eye_open}
        iconStyle={{tintColor: COLORS.secondary}}
        iconSize={25}
        onPress={() => setReveal(!isReveal)}
      />
      <Image
        style={{
          position: 'absolute',
          left: SIZES.padding2,
          width: 25,
          height: 25,
        }}
        source={ImageSrc}
      />
    </View>
  );
};
