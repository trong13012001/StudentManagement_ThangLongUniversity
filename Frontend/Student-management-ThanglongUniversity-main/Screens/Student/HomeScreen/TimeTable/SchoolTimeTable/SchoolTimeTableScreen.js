import React, { useState, useEffect } from "react";

import {
    StyleSheet, TextInput, View, Text, ScrollView, Dimensions, Platform,
    Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert,StatusBar, Button,FlatList
  } from "react-native"; 
import Header from "../../../../../components/Header/Header";



const SchoolTimeTableScreen=()=>{
    return(
        <><Header hasBackButton={true} title={"Thời khóa biểu toàn trường"}></Header>
        <ScrollView>
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Text allowFontScaling={false}>School TimeTable Screen is coming soon!</Text>
        </View></ScrollView></>
    )
}
export default SchoolTimeTableScreen