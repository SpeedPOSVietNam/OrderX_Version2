import React from 'react'
import { View, Text } from 'react-native'

export const LoadingScreen = ({navigation}) => {
    return(
        <View>
            <Text style={{color:'Red', fontSize:20}}>This is loading Screen
            </Text>
        </View>
    )
}