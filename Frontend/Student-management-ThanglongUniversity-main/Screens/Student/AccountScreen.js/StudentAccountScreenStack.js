import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import InformationScreen from "./Information/InformationScreen";
import SettingSrceen from "./Settings/SettingScreen";
import StudentAccountScreen from "./StudentAccountScreen";
const Stack = createStackNavigator();

const StudentAccountScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName="Thông tin">
      <Stack.Screen
        name="Thông tin"
        component={StudentAccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Thông tin sinh viên"
        component={InformationScreen}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Stack.Screen
        name="Cài đặt"
        component={SettingSrceen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StudentAccountScreenStack;
