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
    const statusBarStyle = Platform.OS === 'ios' ? 'light-content':'dark-content';

    return (
        <View>
            
            <StatusBar barStyle={statusBarStyle}/>

            <View style={{ height: Platform.OS === 'ios' && windowHeight>750? 88 : 63, backgroundColor: GlobalStyle.textColor.color }}>
                <View style={{ height: Platform.OS === 'ios' ? "145%" : 60, width: windowWidth, justifyContent: 'center' }} >
                    {
                        hasBackButton ? (
                            <TouchableOpacity
                                onPress={() => { navigation.goBack() }}
                                style={{ marginLeft: '5%', paddingRight: 100 }}
                            >
                                <Icon
                                    name='chevron-left'
                                    size={20}
                                    color={'white'}
                                />
                            </TouchableOpacity>

                        ) : null
                    }
                    <View style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center' }}>
                        <Text allowFontScaling={false} style={{ color: 'white', fontSize: 20,fontWeight:'600' }}>{title}</Text>
                    </View>
                </View>
            </View>
            <NetworkCheck></NetworkCheck>
        </View>    
    )
}

export default Header