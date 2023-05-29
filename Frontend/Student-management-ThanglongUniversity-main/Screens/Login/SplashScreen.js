import{React,useEffect,useState} from "react"
import { View, Image, StyleSheet, ActivityIndicator, Alert,StatusBar } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "../../env/url"
import qs from 'qs';

import { setEnabled } from "react-native/Libraries/Performance/Systrace";

const SplashScreen=({navigation}) => {
    const [userName,setUserName]=useState("");
    const [userPassword,setUserPassword]=useState("");
    const [loading, setLoading] = useState(true);
    const statusBarStyle = Platform.OS === 'ios' ? 'dark-content':'light-content';

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


    const load = async () => {
        const data = {
            username: userName,
            password: userPassword
          };
          
        const formData = qs.stringify(data);
        // Variable used for checking if user's logged in or not
        const isLoggedin = await SecureStore.getItemAsync("isLoggedin");
        
        if (isLoggedin === "true") {
            // If user's logged in already, refresh current accesss token by using refreshToken in SecureStore
            const refreshToken = await SecureStore.getItemAsync("refreshToken");
            console.log(refreshToken)
            await axios.post(`${BASE_URL}/refresh`,refreshToken
            , {
                params: { 'refresh_token': refreshToken},
              })
              
                .then(function (response) {
                    console.log(response)
                    if(response.data.code==400){
                        setLoading(false);
                        navigation.replace("LoginScreen");
                    }
                    // Set new access and refresh token into SecureStore
                    SecureStore.setItemAsync("accessToken", response.data.access_token);
                    SecureStore.setItemAsync("refreshToken", response.data.refresh_Token);
                    
                    setIdSecureStorage();
                    setLoading(false);
                    
                })
                .catch(function (error) {
                    console.log(error)
                    setLoading(false);
                    
                    navigation.replace("LoginScreen");
                });
        }
        else {
            // If user hasn't logged in, navigate to login screen
            setLoading(false);
            navigation.replace("LoginScreen");
        }
    }

    // Call load() function on the first rendering
    useEffect(() => {
        load();
        const timeoutID = setTimeout(() => {
            navigation.replace("LoginScreen");
          }, 10000);
          return () => {
            clearTimeout(timeoutID);
          

    }}, []);



    return(
        <View style={styles.Container}>
            <StatusBar barStyle={statusBarStyle}/>
            <Image
                source={require("../../assets/logo_tlu1.png")}
                style={{
                    height:100,
                    resizeMode:'contain',
                    alignSelf:'center',
                }}
            ></Image>
            <ActivityIndicator
                animating={loading}
                color="gray"
                size="large"
                style={styles.activityIndicator}
            />
        </View>
    );
}
export default SplashScreen;
const styles = StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
        alignItems: "center",
    },
    activityIndicator: {
        alignItems: 'center',
        height: 80,
    },
});