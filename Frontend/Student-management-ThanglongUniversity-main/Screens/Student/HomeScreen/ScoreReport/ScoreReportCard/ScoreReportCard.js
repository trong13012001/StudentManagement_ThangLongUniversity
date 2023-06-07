

import React, { useState, useEffect } from "react";

import {
    StyleSheet, TextInput, View, Text, ScrollView, Dimensions, Platform,
    Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert,StatusBar, Button,FlatList
  } from "react-native"; 
import Header from "../../../../../components/Header/Header";



const ScoreReportCard=()=>{
    return(
        <><Header hasBackButton={true} title={"Phiếu báo điểm"}></Header>
        <ScrollView>
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Text allowFontScaling={false}>Score Report Card is coming soon!</Text>
        </View></ScrollView></>
    )
}
export default ScoreReportCard