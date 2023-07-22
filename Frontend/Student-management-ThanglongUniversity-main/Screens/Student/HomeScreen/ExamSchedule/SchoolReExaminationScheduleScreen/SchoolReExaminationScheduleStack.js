import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SchoolReExaminationScheduleScreen from "./SchoolReExaminationScheduleScreen";
import SchoolReExaminationScheduleTerm from "./SchoolReExaminationScheduleTerm";
const Stack = createStackNavigator();

const SchoolReExaminationScheduleStack = () => {
  return (
    <Stack.Navigator initialRouteName="Danh sách thi từng học kỳ">
      <Stack.Screen
        name="Danh sách thi từng học kỳ"
        component={SchoolReExaminationScheduleTerm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Danh sách môn thi"
        component={SchoolReExaminationScheduleScreen}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
    </Stack.Navigator>
  );
};

export default SchoolReExaminationScheduleStack;
