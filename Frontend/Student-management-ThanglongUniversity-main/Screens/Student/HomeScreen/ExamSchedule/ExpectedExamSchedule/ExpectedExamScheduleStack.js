import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ExpectedExamScheduleTerm from "./ExpectedExamScheduleTerm";
import ExpectedExamSchedule from "./ExpectedExamSchedule";
const Stack = createStackNavigator();

const ExpectedExamScheduleStack = () => {
  return (
    <Stack.Navigator initialRouteName="Danh sách thi dự kiến từng học kỳ">
      <Stack.Screen
        name="Danh sách thi dự kiến từng học kỳ"
        component={ExpectedExamScheduleTerm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Danh sách môn thi dự kiến"
        component={ExpectedExamSchedule}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
    </Stack.Navigator>
  );
};

export default ExpectedExamScheduleStack;
