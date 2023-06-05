import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import InformationScreen from './Information/InformationScreen';
import SettingSrceen from './Settings/SettingScreen';
import TeacherAccountScreen from './TeacherAccountScreen';
const Stack = createStackNavigator();


const TeacherAccountScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName="Thông tin">
      <Stack.Screen name="Thông tin" component={TeacherAccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name='Thông tin giáo viên' component={InformationScreen} options={{headerShown: false, unmountOnBlur: true}}/>
      <Stack.Screen name='Cài đặt' component={SettingSrceen} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}

export default TeacherAccountScreenStack