import { View, Image, Dimensions, Platform, Text } from 'react-native';
import React, { useState } from 'react';
import GlobalStyle from '../../GlobalStyle';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {StatusBar } from 'react-native';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import NetworkCheck from '../NetworkCheck/CheckInternetConnectivity.js'

const Header = ({ hasBackButton, title }) => {
    let navigation = useNavigation();
    const statusBarStyle = Platform.OS === 'ios' ? 'dark-content':'dark-content';

    return (
       
            
            <><StatusBar barStyle={statusBarStyle} />
            <View style={{ height: Platform.OS==="ios"?"14%":"10%",top:"10%" }}>
            <View style={{  justifyContent: 'center'}}>
                {hasBackButton ? (
                    <TouchableOpacity
                        onPress={() => { navigation.goBack(); } }
                        style={{ marginLeft: '5%', paddingRight: 100 }}
                    >
                        <Icon
                            name='chevron-left'
                            size={30}
                            color={GlobalStyle.textColor.color} />
                    </TouchableOpacity>

                ) : null}
                <View style={{ position: 'absolute', marginLeft: '15%' }}>
                    <Text allowFontScaling={false} style={{ color: 'white', fontSize: (Platform.OS === 'ios' && windowWidth>400) ? 26 : 26*(windowWidth/428), fontWeight: '600',color:GlobalStyle.textColor.color }}>{title}</Text>
                </View>
            </View>
        </View></>
            
        
    )
}

export default Header