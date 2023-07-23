import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OfficialExamSchedule from "./OfficialExamSchedule";
import OfficialExamScheduleTerm from "./OfficialExamScheduleTerm";
const Stack = createStackNavigator();

const OfficialExamScheduleStack = () => {
  return (
    <Stack.Navigator initialRouteName="Danh sách thi chính thức từng học kỳ">
      <Stack.Screen
        name="Danh sách thi chính thức từng học kỳ"
        component={OfficialExamScheduleTerm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Danh sách môn thi chính thức"
        component={OfficialExamSchedule}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
    </Stack.Navigator>
  );
};

export default OfficialExamScheduleStack;
