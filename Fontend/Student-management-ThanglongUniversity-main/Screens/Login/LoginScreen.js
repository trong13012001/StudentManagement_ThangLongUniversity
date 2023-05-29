import React, { useState, useRef } from "react";
import {
  StyleSheet, TextInput, View, Text, ScrollView, Dimensions, Platform,
  Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert,StatusBar
} from "react-native"; 
import Loader from "../../components/Loader/Loader";
import Icon from 'react-native-vector-icons/FontAwesome5';
import qs from 'qs';
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { BASE_URL } from "../../env/url";
const windowHeight=Dimensions.get('window').height;
const windowWidth=Dimensions.get('window').width;
const statusBarStyle = Platform.OS === 'ios' ? 'dark-content':'light-content';

const LoginScreen=({navigation})=>{
  
    const [userName,setUserName]=useState("");
    const [userPassword,setUserPassword]=useState("");
    const [loading, setLoading]=useState(false);
    const [hide,setHide]=useState(true);
    const passwordInputRef=useRef();
    const userNameInputRef=useRef();




    let handleSubmitPress = async()=>{
        if(!userName){
            Alert.alert(
                "",
                "Vui lòng nhập tên.",
                [{text:"OK"}]
            );
            return;
        }
        if(!userPassword){
            Alert.alert(
                "",
                "Vui lòng nhập mật khẩu.",
                [{text:"OK"}]
            );
            return;
        }
        setLoading(true)
        const data = {
          username: userName,
          password: userPassword
        };
        
        const formData = qs.stringify(data);
        await axios.post(`${BASE_URL}/login`,formData,
        {
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
        ).then(function(response){

            SecureStore.setItemAsync("isLoggedin", "true");
            SecureStore.setItemAsync("accessToken", response.data.token.access_token);
            SecureStore.setItemAsync("refreshToken", response.data.token.refresh_token);
            console.log(response.data.token.access_token)
            console.log(response.data.token.refresh_token)
            
            setIdSecureStorage();
            setLoading(false);   
            }
        )
        .catch(function (error) {
          console.log(error.response.status);

          if(error.response.status==400){
          console.log(error.response.data);
          // Login failed, display alert messages
          setLoading(false);
          Alert.alert(
            "Đăng nhập thất bại",
            `${error.response.data.message}`,
            [{ text: "OK" }]
          );
        }});
        userNameInputRef.current.clear();
        passwordInputRef.current.clear();
        setUserName('');
        setUserPassword('');
    };
    let moveToPasswordInput=()=>{
        passwordInputRef.current.focus();
    };


    const setIdSecureStorage = async () => {
      // Variables used for calling API
      const accessToken = await SecureStore.getItemAsync("accessToken");
      
      const authorization = `Bearer ${accessToken}`
      console.log(authorization)
      // Calling API
      await axios.get(`${BASE_URL}/user`,
        {
          headers: {
            'Content-Type': 'application/json',
            'authorization':authorization,
          },
        })
        .then(function (response) {
          if(response.data.user.role=="1"){
          // Checking if user is on the onsite list or not
          console.log(response.data.student)
            SecureStore.setItemAsync("studentId", `${response.data.student.student_id}`)
            SecureStore.setItemAsync("fullName", `${response.data.student.name}`)
            SecureStore.setItemAsync("email", `${response.data.student.email}`)
            navigation.replace("StudentMainScreen");
            }
          if(response.data.user.role=="2"){
            console.log(response.data.teacher)
            SecureStore.setItemAsync("teacherId", `${response.data.teacher.teacher_id}`)
            SecureStore.setItemAsync("fullName", `${response.data.teacher.name}`)
            SecureStore.setItemAsync("email", `${response.data.teacher.email}`)
            navigation.replace("TeacherMainScreen");
          }
          }

        ) 
        .catch(function (error) {
          SecureStore.setItemAsync("isLoggedin", "false");
          SecureStore.deleteItemAsync('accessToken');
          SecureStore.deleteItemAsync('refreshToken');
          Alert.alert(
            "",
            `Đăng nhập thất bại. (code: ${error.response.status})`,
            [{ text: "OK" }]
          );
          console.log('setIdSecureStorage', error.response.status);
        })
    }
    return(
        <>
              <StatusBar barStyle={statusBarStyle}/>

        {/* background */}
        <View>
          <View style={{ height: windowHeight, width: windowWidth, position: 'absolute' }}>
            <Image source={require('../../assets/bg1.webp')} style={{ width: windowWidth, height: windowHeight }} />
          </View>
        </View>
  
        {/* loginform */}
        <View style={styles.mainBody}>
          <Loader loading={loading} />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'flex-end',
              alignContent: "center",
            }}
          >
            <KeyboardAvoidingView enabled behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
              <View style={{
                backgroundColor: 'white',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                bottom: 0,
                zIndex: 2,
                elevation: 2,
              }}>
  
                <View style={{ alignItems: 'center', paddingTop:10 }}>
                <Image
                source={require("../../assets/logo_tlu1.png")}
                style={{
                    height:100,
                    resizeMode:'contain',
                    alignSelf:'center',
                    
                }}
                ></Image>
                </View>
                <View style={styles.SectionStyle}>
                  <TextInput
                  allowFontScaling={false}
                    style={styles.inputStyle}
                    ref={userNameInputRef}
                    onChangeText={(UserName) => setUserName(UserName)}
                    placeholder="Nhập tài khoản"
                    placeholderTextColor="#8b9cb5"
                    autoCapitalize="none"
                    keyboardType="default"
                    returnKeyType="next"
                    onSubmitEditing={moveToPasswordInput}
                    underlineColorAndroid="#f000"
                    blurOnSubmit={false}
                  />
                </View>
                <View style={styles.SectionStyle}>
                  <TextInput
                    allowFontScaling={false}
                    style={styles.inputStyle}
                    onChangeText={(UserPassword) => setUserPassword(UserPassword)}
                    placeholder="Nhập mật khẩu"
                    placeholderTextColor="#8b9cb5"
                    autoCapitalize="none"
                    keyboardType="default"
                    ref={passwordInputRef}
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={false}
                    secureTextEntry={hide ? true : false}
                    underlineColorAndroid="#f000"
                    returnKeyType="next" />
                  <TouchableOpacity
                    onPress={() => setHide(!hide)}
                    style={{ alignSelf: 'flex-end', position: 'absolute', padding: 20 }}>
                    <Icon
                    size={25}
                    name={hide ? 'eye-slash' : 'eye'}
                  />
                  </TouchableOpacity>
                </View>
  
  
                <TouchableOpacity
                
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                  onPress={handleSubmitPress}
                >
                  <Text allowFontScaling={false} style={styles.buttonTextStyle}>Đăng nhập</Text>
                </TouchableOpacity>
  
                {/*Dang ky*/}
                {
                  Platform.OS === 'ios' ? (
                    <TouchableOpacity
                      style={{
                        height: 60,
                        marginBottom: 10,
                        marginLeft:45,
                        justifyContent: 'center',
                      }}
                      activeOpacity={0.5}
                    >
                      <Text allowFontScaling={false}><Text style={{
                        paddingVertical: 12,
                        fontSize: 14,
                      }}>Quên mật khẩu?</Text></Text>
  
                    </TouchableOpacity>
                  ) : (
                    <View style={{ alignSelf: 'center', marginTop: 32, bottom: 20 }} />
                  )}
                {/*Dang ky*/}
                 {/* <View style={{ alignSelf: 'center', paddingTop: 10, bottom: 20 }}>
                  <Text>Bản quyền thuộc về Viettel Software Service</Text>
                </View>  */}
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
  
        </View>
      </>

    )
    
}
export default LoginScreen;
const styles = StyleSheet.create({
    mainBody: {
      flex: 1,
      justifyContent: "center",
      alignContent: "center",
    },
  
    SectionStyle: {
      // flexDirection: "row",
      height: 60,
      marginTop: 20,
      marginLeft: 40,
      marginRight: 40,
      margin: 10,
      justifyContent: 'center'
    },
    buttonStyle: {
      backgroundColor:"#ee242d",
      borderWidth: 0,
      color: "#FFFFFF",
      borderColor: "#7DE24E",
      height: 60,
      alignItems: "center",
      borderRadius: 12,
      marginLeft: 40,
      marginRight: 40,
      marginTop: 30,
      justifyContent: 'center',
    },
    buttonTextStyle: {
      color: "#FFFFFF",
      paddingVertical: 12,
      fontSize: 20,
      fontWeight:'500'
    },
    inputStyle: {
      flex: 1,
      color: "black",
      paddingLeft: 15,
      paddingRight: 50,
      borderWidth: 1,
      borderRadius: 15,
      borderColor: "#dadae8",
      fontSize:16,
    },
  });