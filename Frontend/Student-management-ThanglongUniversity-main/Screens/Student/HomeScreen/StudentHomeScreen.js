import React, { useState, useEffect } from "react";
import {
    StyleSheet, TextInput, View, Text, ScrollView, Dimensions, Platform,
    Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert,StatusBar, Button
  } from "react-native"; 
import axios from "axios";
import { BASE_URL } from "../../../env/url"; 
import * as SecureStore from "expo-secure-store";
import Header from "../../../components/Header/Header";
import GlobalStyle from "../../../GlobalStyle";
const statusBarStyle = Platform.OS === 'ios' ? 'dark-content':'light-content';
let windowWidth = Dimensions.get('window').width;


const StudentHomeScreen=({navigation})=>{
  const [user_id, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [emailStudent, setEmail] = useState("");
  const [phone,setPhone]=useState("")
  const [gender,setGender]=useState("")
  const [address,setAddress]=useState("")
  const [loading, setLoading] = useState(true);

  const load = async () => {
    // Variables used for calling API....
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const authorization = `Bearer ${accessToken}`

    // Calling API
    await axios.get(`${BASE_URL}/user`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": authorization,
        },
      })
      .then(function (response) {
        console.log(response)
        setUserID(response.data.user.userName);
        setUserName(response.data.student.studentName);
        setEmail(response.data.user.userEmail);
        setPhone(response.data.student.studentPhone)
        setGender(response.data.student.studentGender)
        setAddress(response.data.student.studentAddress)
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      })
  }

  // Call load() function on the first rendering  
  useEffect(() => {
    load();
  }, [])



    return(
        <>
        
        <StatusBar barStyle={statusBarStyle}/>
        <View style={{marginLeft:"5%",top:"10%"}}>
          <Text style={styles.header}>ThangLong University</Text>
          <Text style={styles.header2}>Xin chào!</Text>
          <Text style={styles.header3}><Text style={{textTransform: 'uppercase'}}>{user_id} </Text>{userName}</Text>
        </View>
        <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Họ tên: {userName}</Text>
        <Text>Email: {emailStudent}</Text>
        <Text>Điện thoại: {phone}</Text>
        <Text>Giới tính: {gender}</Text>
        <Text>Địa chỉ: {address}</Text>
      </View></>
        
)
}

export default StudentHomeScreen;
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