import React, { useState, useEffect } from "react";

import {
    StyleSheet, TextInput, View, Text, ScrollView, Dimensions, Platform,
    Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert,StatusBar, Button,FlatList
  } from "react-native"; 
import Header from "../../../../components/Header/Header";
const InformationScreen=()=>{
    return(
        <><Header hasBackButton={true} title={"Thông tin sinh viên"}></Header>
        <ScrollView>
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Text>Information Screen</Text>
        </View></ScrollView></>
    )
}
export default InformationScreen