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

const StudentHomeScreen=({navigation})=>{
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
        setUserName(response.data.student.name);
        setEmail(response.data.user.email);
        setPhone(response.data.student.phone)
        setGender(response.data.student.gender)
        setAddress(response.data.student.address)
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
  const handleLogout = async () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc bạn muốn đăng xuất?",
      [
        {
          text: "Quay lại",
        },
        {
          text: "Đăng xuất",
          onPress: () => {
            // Clear data inside SecureStore
            SecureStore.deleteItemAsync('accessToken');
            SecureStore.deleteItemAsync('refreshToken');
            navigation.replace("LoginScreen");

          },
        },
      ]
    );
  }



    return(
        <>
        
        <StatusBar barStyle={statusBarStyle}/>
        <View style={{marginLeft:"5%",top:"10%"}}>
          <Text style={styles.header}>ThangLong University</Text>
          <Text style={styles.header2}>Xin chào!</Text>
          <Text style={styles.header3}>{userName}</Text>
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
        <Button title="Logout" onPress={handleLogout} />
      </View></>
        
)
}

export default StudentHomeScreen;
const styles = StyleSheet.create({

  header:{
    fontSize: 36,
    fontWeight:"600",
    color:GlobalStyle.textColor.color
  },
  header2:{
    fontSize: 30,
    fontWeight:"600",
    color:GlobalStyle.themeColor.color
  }
  ,
  header3:{
    fontSize: 24,
    fontWeight:"600",
    color:GlobalStyle.textColor.color
  }
});
