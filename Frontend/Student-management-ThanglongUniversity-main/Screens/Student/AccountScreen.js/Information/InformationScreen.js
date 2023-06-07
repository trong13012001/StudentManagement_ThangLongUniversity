import React, { useState, useEffect } from "react";
import {
    StyleSheet, TextInput, View, Text, ScrollView, Dimensions, Platform,
    Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert,StatusBar, Button,FlatList
  } from "react-native"; 
import axios from "axios";
import { BASE_URL } from "../../../../env/url"; 
import * as SecureStore from "expo-secure-store";
import Icon1 from 'react-native-vector-icons/Ionicons';
import GlobalStyle from "../../../../GlobalStyle";
import { CommonActions } from "@react-navigation/native";
import Header from "../../../../components/Header/Header";
const InformationScreen=()=>{
    const [userID, setUserID] = useState("");
    const [userName, setUserName] = useState("");
    const [emailStudent, setEmail] = useState("");
    const [phone,setPhone]=useState("")
    const [gender,setGender]=useState("")
    const [major,setMajor]=useState("")
    const [branch,setBranch]=useState("")
    const [address,setAddress]=useState("")
    const [loading, setLoading] = useState(true);
    const [b64, setB64] = useState('');

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
            setUserID(response.data.student.studentID)
            setUserName(response.data.student.studentName);
            setGender(response.data.student.studentGender)
            setPhone(response.data.student.studentPhone)
            setEmail(response.data.user.userEmail);
            setMajor(response.data.major.majorName)
            setBranch(response.data.branch.branchName)
            setB64(response.data.image.image)
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
      const renderItem = ({ item }) => (
          <View style={styles.itemwrapper}>
            <View style={[styles.item]}>
              <Text allowFontScaling={false} style={{fontSize: 16,fontWeight:"600",color:GlobalStyle.textColor.color,width:"37%" }}>{item.title}</Text>
              <Text allowFontScaling={false} style={{fontSize: 16 ,fontWeight:"600",color:GlobalStyle.textColor.color}}>{item.content}</Text>

            </View> 
          </View>
      );
    return(
        <><Header hasBackButton={true} title={"Thông tin sinh viên"}></Header>
        <ScrollView>
        <View style={{alignItems:"center",justifyContent:"center"}}>
            <Image source={{uri:`data:image/png;base64,${b64}`}} style={{width:100,height:100, resizeMode: 'contain',borderRadius:50 }} />
        </View>
        <View style={styles.wrapper}>
                  <FlatList
                    data={[
                      {
                        title: 'Mã sinh viên:',
                        content:<Text style={{textTransform: 'uppercase'}}>{userID} </Text>
                      },
                      {
                        title: 'Họ tên:',
                        content: userName,

                      },
                      {
                        title: 'Giới tính:',
                        content: gender,

                      },
                      {
                        title: 'Khoa:',
                        content: major,

                      },
                    {
                        title: 'Ngành:',
                        content: branch,

                      },
                      {
                        title: 'Email:',
                        content: emailStudent,

                      },

                      {
                        title: 'Số điện thoại:',
                        content: phone,

                      },
        
                    ]}
                    renderItem={renderItem}
                    scrollEnabled={false}
                  /></View>
                  </ScrollView></>
    )
}
export default InformationScreen
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    background:{
      width: "100%",
      height:250,
    
    },
    textContainer: {
      height: '30%',
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      fontSize: 16,
      paddingTop: 5,
    },
    wrapper:{
        width: '90%',
        backgroundColor: 'white',
        borderRadius:15,
        marginLeft:"5%",
        top:"8%",
    },
    itemwrapper: {
      height: 50,
      justifyContent: 'center',
      
    },
    item: {
      flexDirection: 'row',
      marginLeft:"5%"
    },
    buttonStyle: {
      alignSelf: 'center',
      backgroundColor: GlobalStyle.themeColor.color,
      alignItems: "center",
      borderRadius: 30,
      justifyContent: 'center',
      padding: 15,
      paddingHorizontal: 20,
    },
    tableContainer: {
      height: '75%',
    },
    tableRow: {
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
      justifyContent: 'space-between'
    },
    activityIndicator: {
      alignItems: 'center',
      justifyContent: 'center'
    }
  });