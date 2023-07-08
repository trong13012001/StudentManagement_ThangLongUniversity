import React, { useState, useEffect } from "react";
import {
    StyleSheet, TextInput, View, Text, ScrollView, Dimensions, Platform,
    Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert,StatusBar,FlatList
  } from "react-native"; 
import axios from "axios";
import { BASE_URL } from "../../../env/url"; 
import * as SecureStore from "expo-secure-store";
import { CommonActions } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Icon2 from "phosphor-react-native";

import GlobalStyle from "../../../GlobalStyle";
const statusBarStyle = Platform.OS === 'ios' ? 'dark-content':'light-content';
let windowWidth = Dimensions.get('window').width;

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

      })
      .catch(function (error) {
        console.log(error);
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
                        onPress: () => {
                          navigation.dispatch(
                            CommonActions.navigate({ name: 'Thời khóa biểu toàn trường' })
                          );
                        }
                      },
                      {
                        title: 'Lịch thi lại toàn trường',
                        icon: 'calendar-search',
                        onPress: () => {
                          navigation.dispatch(
                            CommonActions.navigate({ name: 'Lịch thi lại toàn trường' })
                          );
                        }
                      },
        
                      {
                        title: 'Chương trình đào tạo',
                        icon: 'school',
                        onPress: () => {navigation.dispatch(CommonActions.navigate({ name: 'Chương trình đào tạo' }));}
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
                        onPress: () => {navigation.dispatch(CommonActions.navigate({ name: 'Đăng ký học' }));}

                      },
                      {
                        title: 'Đăng ký thi lại',
                        icon: 'calendar-edit',
                        onPress: () => {navigation.dispatch(CommonActions.navigate({ name: 'Đăng ký thi lại' }));}

                      },
        
                      {
                        title: 'Phiếu báo thu tiền',
                        icon:"cash-check",
                        onPress: () => {navigation.dispatch(CommonActions.navigate({ name: 'Phiếu báo thu tiền' }));}

                      },
                      {
                        title: 'Bảng điểm',
                        icon: 'file-account-outline',
                        onPress: () => {navigation.dispatch(CommonActions.navigate({ name: 'Bảng điểm' }));}

                      }
                      ,
                      {
                        title: 'Lịch thi chính thức',
                        icon: 'calendar-check',
                        onPress: () => {navigation.dispatch(CommonActions.navigate({ name: 'Lịch thi chính thức' }));}


                      },
                      {
                        title: 'Lịch thi dự kiến',
                        icon: 'calendar-question',
                        onPress: () => {navigation.dispatch(CommonActions.navigate({ name: 'Lịch thi dự kiến' }));}


                      },
                      {
                        title: 'Phiếu báo điểm',
                        icon: 'file-chart-outline',
                        onPress: () => {navigation.dispatch(CommonActions.navigate({ name: 'Phiếu báo điểm' }));}


                      },
                      {
                        title: 'Lịch ký sổ gốc',
                        icon: 'pencil-plus-outline',
                        onPress: () => {navigation.dispatch(CommonActions.navigate({ name: 'Lịch ký sổ gốc' }));}


                      },
                      {
                        title: 'Định hướng học tập',
                        icon: 'trending-up',
                        onPress: () => {navigation.dispatch(CommonActions.navigate({ name: 'Định hướng học tập' }));}


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
    height:  "41%"
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