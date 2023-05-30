import React, { useState, useRef } from "react";
import {
    StyleSheet, TextInput, View, Text, ScrollView, Dimensions, Platform,
    Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert,StatusBar
  } from "react-native"; 
import GlobalStyle from "../../../GlobalStyle";
const statusBarStyle = Platform.OS === 'ios' ? 'dark-content':'light-content';
let windowWidth = Dimensions.get('window').width;

const TimeTable=()=>{
    return(
      <>
        <StatusBar barStyle={statusBarStyle}/>
        <View style={{marginLeft:"5%",top:"10%"}}>
          <Text style={styles.header}>Thời Khóa Biểu</Text>
          <Text style={styles.header2}>Học kỳ 3 - Nhóm 2</Text>
          <Text style={styles.header3}></Text>
        </View>
      </>
)
}

export default TimeTable;
const styles = StyleSheet.create({

  header:{
    fontSize:(Platform.OS === 'ios' && windowWidth>400) ? 36 : 36*0.6,
    fontWeight:"600",
    color:GlobalStyle.textColor.color
  },
  header2:{
    fontSize: (Platform.OS === 'ios' && windowWidth>400) ? 30 : 30*0.6,
    fontWeight:"600",
    color:GlobalStyle.themeColor.color
  }
  ,
  header3:{
    fontSize: (Platform.OS === 'ios' && windowWidth>400) ? 24 : 24*0.6,
    fontWeight:"600",
    color:GlobalStyle.textColor.color
  }
});