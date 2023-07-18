import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import ScoreReportCardTerm from './ScoreReportCardTerm';
import ScoreReportCard from './ScoreReportCard';
const Stack = createStackNavigator();


const ScoreReportCardStack= () => {
  return (
    <Stack.Navigator initialRouteName="Phiếu báo điểm từng học kỳ">
      <Stack.Screen name="Phiếu báo điểm từng học kỳ" component={ScoreReportCardTerm} options={{ headerShown: false }} />
      <Stack.Screen name='Phiếu báo điểm' component={ScoreReportCard} options={{headerShown: false, unmountOnBlur: true}}/>
    </Stack.Navigator>
  )
}

export default ScoreReportCardStack