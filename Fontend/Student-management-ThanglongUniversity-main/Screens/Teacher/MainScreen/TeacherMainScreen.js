import React, { useState, useRef } from "react";
import {
    StyleSheet, TextInput, View, Text, ScrollView, Dimensions, Platform,
    Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert,StatusBar
  } from "react-native"; 
import Icon from 'react-native-vector-icons/FontAwesome5';
import GlobalStyle from '../../../GlobalStyle';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TeacherHomeScreen from "../HomeScreen/TeacherHomeScreen";
import TimeTable from "../../TimeTable/TimeTable"
let windowWidth = Dimensions.get('window').width;

const Tab = createBottomTabNavigator();

const TeacherMainScreen=()=>{
    return(
      <Tab.Navigator
      initialRouteName="Trang chủ"
      id='tab'
      keyboardDismissMode='none'
      screenOptions={
        {
          tabBarHideOnKeyboard: Platform.OS==="android"?true:false,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: Platform.OS === 'ios' ? '10%' : '10%',
            position: 'absolute',
          }
        }
      }
    >
      <Tab.Screen
        name="Thời khóa biểu"
        component={TimeTable}
        options={{
          tabBarIcon:({focus,color,size})=>(
            <View style={{alignItems:'center', width: windowWidth > 800 ? 100 : undefined}}>
              <Icon></Icon>
            </View>
          )
        }}
      
      />
       

      
      <Tab.Screen
        name="Trang chủ"
        component={TeacherHomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ alignItems: 'center', width: windowWidth > 800 ? 100 : undefined }}>
              <Icon name="home" color={focused ? GlobalStyle.themeColor.color : color} size={size} />
              <Text allowFontScaling={false} style={{ color: focused ? GlobalStyle.themeColor.color : color, paddingTop: 5,fontSize:12, }}>Trang chủ</Text>
            </View>
          ),
        }}
      />
</Tab.Navigator>

)
}
const styles = StyleSheet.create({
    container: {
      
      textAlign:"center",
    },
  });
export default TeacherMainScreen;
