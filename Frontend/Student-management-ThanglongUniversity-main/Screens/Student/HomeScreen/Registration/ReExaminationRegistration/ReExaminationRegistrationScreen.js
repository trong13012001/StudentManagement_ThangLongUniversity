import React, { useState, useEffect } from "react";

import {
    StyleSheet, TextInput, View, Text, ScrollView, Dimensions, Platform,
    Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert,StatusBar, Button,FlatList
  } from "react-native"; 
import Header from "../../../../../components/Header/Header";



const ReExaminationRegistrationScreen=()=>{
    return(
        <><Header hasBackButton={true} title={"Đăng ký thi lại"}></Header>
        <ScrollView>
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Text allowFontScaling={false}>Re Examination Registration Screen is coming soon!</Text>
        </View></ScrollView></>
    )
}
export default ReExaminationRegistrationScreen