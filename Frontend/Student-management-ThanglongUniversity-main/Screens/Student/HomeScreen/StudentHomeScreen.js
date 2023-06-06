import React, { useState, useEffect } from "react";
import {
    StyleSheet, TextInput, View, Text, ScrollView, Dimensions, Platform,
    Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert,StatusBar,FlatList
  } from "react-native"; 
import axios from "axios";
import { BASE_URL } from "../../../env/url"; 
import * as SecureStore from "expo-secure-store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CommonActions } from "@react-navigation/native";
import { faCoffee, faHeart, faStar } from '@fortawesome/free-solid-svg-icons';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import GlobalStyle from "../../../GlobalStyle";
const statusBarStyle = Platform.OS === 'ios' ? 'dark-content':'light-content';
let windowWidth = Dimensions.get('window').width;
console.log(windowWidth)

const StudentHomeScreen=({navigation})=>{
  const [user_id, setUserID] = useState("");
  const [userName, setUserName] = useState("");


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
        setUserID(response.data.user.userName);
        setUserName(response.data.student.studentName);

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
    <TouchableOpacity
      onPress={item.onPress}
      key={item.key}>
      <View style={styles.itemwrapper}>
        <View style={[styles.item]}>
          <Icon  name={item.icon} size={(Platform.OS === 'ios' && windowWidth>400) ? 40 : 40*(windowWidth/428)} color={"#07038c"}/>
        </View> 
        <View style={{width:windowWidth*0.23}}><Text allowFontScaling={false} style={{ fontSize: (Platform.OS === 'ios' && windowWidth>400) ? 14 : 14*(windowWidth/428), textAlign:"center",color:GlobalStyle.textColor.color,top:"15%"}}>{item.title}</Text></View>

      </View>
    </TouchableOpacity>
  );



    return(
        <>
        
        <StatusBar barStyle={statusBarStyle}/>
        <View style={{marginLeft:"5%",top:"10%"}}>
          <Text allowFontScaling={false} style={styles.header}>ThangLong University</Text>
          <Text allowFontScaling={false} style={styles.header2}>Xin chào!</Text>
          <Text allowFontScaling={false} style={styles.header3}><Text style={{textTransform: 'uppercase'}}>{user_id} </Text>{userName}</Text>
        </View>

        <View style={styles.wrapper1}>
          <FlatList
                    data={[
                      {
                        title: 'Thời khóa biểu toàn trường',
                        icon: 'calendar-month',

                      },
                      {
                        title: 'Lịch thi lại toàn trường',
                        icon: 'calendar-search',

                      },
        
                      {
                        title: 'Chương trình đào tạo',
                        icon: 'school',
                      },
                    ]}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    numColumns={3}
                    horizontal={false} 

                  />
      </View>
        <View style={styles.wrapper}>
          <FlatList
                    data={[
                      {
                        title: 'Đăng ký học',
                        icon: 'calendar-plus',

                      },
                      {
                        title: 'Đăng ký thi lại',
                        icon: 'calendar-edit',

                      },
        
                      {
                        title: 'Phiếu báo thu tiền',
                        icon:"cash-check",
                      },
                      {
                        title: 'Bảng điểm',
                        icon: 'file-account-outline',
                      }
                      ,
                      {
                        title: 'Lịch thi chính thức',
                        icon: 'calendar-check',

                      },
                      {
                        title: 'Lịch thi dự kiến',
                        icon: 'calendar-question',

                      },
                      {
                        title: 'Phiếu báo điểm',
                        icon: 'file-chart-outline',

                      },
                      {
                        title: 'Lịch ký sổ gốc',
                        icon: 'pencil-plus-outline',

                      },
                      {
                        title: 'Định hướng học tập',
                        icon: 'trending-up',

                      },


                    ]}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    numColumns={3}
                    horizontal={false} 

                  />
      </View>

      
      
      </>
        
)
}

export default StudentHomeScreen;
const styles = StyleSheet.create({

  header:{
    fontSize:(Platform.OS === 'ios' && windowWidth>400) ? 36 : 36*(windowWidth/428),
    fontWeight:"600",
    color:GlobalStyle.textColor.color
  },
  header2:{
    fontSize: (Platform.OS === 'ios' && windowWidth>400) ? 30 : 30*(windowWidth/428),
    fontWeight:"600",
    color:GlobalStyle.themeColor.color
  }
  ,
  header3:{
    fontSize: (Platform.OS === 'ios' && windowWidth>400) ? 24 : 24*(windowWidth/428),
    fontWeight:"600",
    color:GlobalStyle.textColor.color
  },
  itemwrapper: {
    marginTop:"15%",
    width:windowWidth*0.3,
    alignContent:"center",
    alignItems:"center",
    
  },
  item: {
    flexDirection: "column",
    alignSelf:"center",
    alignItems:"center",
    backgroundColor:"#eeeded",
    borderRadius:20,
    height:(Platform.OS === 'ios' && windowWidth>400) ? 66 : 66*(windowWidth/428),
    width:(Platform.OS === 'ios' && windowWidth>400) ? 66 : 66*(windowWidth/428),
    justifyContent:"center",
    shadowColor:"gray",
    shadowOpacity:0.3

  },
  wrapper:{
    
    width: '90%',
    backgroundColor: 'white',
    borderRadius:15,
    marginLeft:"5%",
    top:"17%",
    height:  "40%"
},
wrapper1:{
  width: '90%',
  backgroundColor: 'white',
  borderRadius:15,
  marginLeft:"5%",
  top:"15%",
  height: "15%"
},
});