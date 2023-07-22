import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PaymentReceiptScreen from "./PaymentReceiptScreen";
import PaymentReceiptTermScreen from "./PaymentReceiptTermScreen";
const Stack = createStackNavigator();

const PaymentReceiptStack = () => {
  return (
    <Stack.Navigator initialRouteName="Danh sách học phí từng học kỳ">
      <Stack.Screen
        name="Danh sách học phí từng học kỳ"
        component={PaymentReceiptTermScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Danh sách học phí"
        component={PaymentReceiptScreen}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
    </Stack.Navigator>
  );
};

export default PaymentReceiptStack;
