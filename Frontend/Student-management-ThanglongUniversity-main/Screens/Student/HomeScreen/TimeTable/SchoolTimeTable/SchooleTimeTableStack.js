import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import SchoolTimeTableListTerm from './SchoolTimeTableListTerm';
import SchoolTimeTableScreen from './SchoolTimeTableScreen';
const Stack = createStackNavigator();


const SchooleTimeTableStack = () => {
  return (
    <Stack.Navigator initialRouteName="Danh sách học kỳ">
      <Stack.Screen name="Danh sách học kỳ" component={SchoolTimeTableListTerm} options={{ headerShown: false }} />
      <Stack.Screen name='Thời khóa biểu toàn trường' component={SchoolTimeTableScreen} options={{headerShown: false, unmountOnBlur: true}}/>
    </Stack.Navigator>
  )
}

export default SchooleTimeTableStack