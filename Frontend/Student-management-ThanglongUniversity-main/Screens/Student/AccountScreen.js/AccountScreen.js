import React, { useState, useEffect } from "react";
import {
    StyleSheet, TextInput, View, Text, ScrollView, Dimensions, Platform,
    Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert,StatusBar, Button,FlatList
  } from "react-native"; 
import axios from "axios";
import { BASE_URL } from "../../../env/url"; 
import * as SecureStore from "expo-secure-store";
import Header from "../../../components/Header/Header";
import Icon1 from 'react-native-vector-icons/Ionicons';
import GlobalStyle from "../../../GlobalStyle";
const AccountScreen=({navigation})=>{
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
        setUserID(response.data.student.student_id)
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
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={item.onPress}
      key={item.key}>
      <View style={styles.itemwrapper}>
        <View style={[styles.item]}>
          <Icon1 style={{paddingLeft:"1.5%"} } name={item.icon} size={20} color={GlobalStyle.textColor.color} />
          <Text allowFontScaling={false} style={{ paddingLeft: "2.79%",fontSize: 16, paddingTop:"0.5%" }}>{item.title}</Text>
          {(item.title === 'Đăng xuất') || (item.title === 'Xóa tài khoản') ? null : (<Icon1 name="chevron-forward" size={15} style={{ position:"absolute", top:"15%",left:"93%",color:GlobalStyle.textColor.color}} />)}
        </View> 
      </View>
    </TouchableOpacity>
  );


    return(
        <View style={styles.container}>
            <>
              <ScrollView>
            
                <View style={{height: '70%',alignItems: 'center',justifyContent: 'center'}}>
                  <Image source={require('../../../assets/user1.png')} style={{width:72,height:72, resizeMode: 'contain' }} />
                  <Text allowFontScaling={false} style={[styles.text, { fontWeight: 'bold',fontSize:16,paddingTop:16,paddingBottom:4 ,textTransform: 'uppercase'}]}>{user_id} - {userName}</Text>
                  <Text allowFontScaling={false} style={[styles.text, { color: GlobalStyle.textColor.color,fontSize:14 }]}>{emailStudent}</Text></View>
                <View>
                  <FlatList
                    data={[
                      {
                        title: 'Thông tin tài khoản',
                        icon: 'information-circle',
                      },
                      {
                        title: 'Cài đặt',
                        icon: 'settings',
                      },
        
                      {
                        title: 'Đăng xuất',
                        icon: 'log-out',
                        onPress: () => { handleLogout() }
                      }
                    ]}
                    renderItem={renderItem}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </>
        </View>
        
)
}

export default AccountScreen;
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
    icon: {
      padding: 20,
      borderWidth: 1,
      borderColor: GlobalStyle.themeColor.color,
      borderRadius: Platform.OS === 'ios' ? 35 : 50,
    },
    text: {
      fontSize: 16,
      paddingTop: 5,
    },
    itemwrapper: {
      width: '90%',
      backgroundColor: 'white',
      height: 70,
      marginTop: 5,
      marginLeft:"5%",
      justifyContent: 'center',
      paddingLeft: 10,
      borderRadius:15,
    
    },
    item: {
      flexDirection: 'row',
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