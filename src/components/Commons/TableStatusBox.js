import React, {useState} from 'react';

import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../constants/theme';
import icons from '../../constants/icons';

export const TableStatusBox = () => {
  const [Status, setStatus] = useState(true);
  return (
    <TouchableOpacity
      style={{
        width: 300,
        height: 60,
        backgroundColor: COLORS.TableStatusRed,
        borderRadius: SIZES.radius,
      }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={styles.TextStatus}>Table ID:</Text>
        <Text style={styles.TextStatus}>3</Text>
        <Text style={styles.TextStatus}>{Status ? 'Occupied' : 'Empty'}</Text>
        <Image source={icons.verify} />
      </View>
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  TextStatus: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.h4,
  },
});
