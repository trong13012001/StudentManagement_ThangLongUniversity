import{React,useEffect,useState} from "react"
import { View, Image, StyleSheet, ActivityIndicator, Alert,StatusBar } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "../../env/url"
import qs from 'qs';


const SplashScreen=({navigation}) => {
    const [userName,setUserName]=useState("");
    const [userPassword,setUserPassword]=useState("");
    const [loading, setLoading] = useState(true);
    const statusBarStyle = Platform.OS === 'ios' ? 'dark-content':'light-content';

    const setIdSecureStorage = async () => {
        // Variables used for calling API
        const accessToken = await SecureStore.getItemAsync("accessToken");
        
        const authorization = `Bearer ${accessToken}`
        // Calling API
        await axios.get(`${BASE_URL}/user`,
          {
            headers: {
              'Content-Type': 'application/json',
              'authorization':authorization,
            },
          })
          .then(function (response) {
            if(response.data.user.userRole==1){
            // Checking if user is on the onsite list or not
              SecureStore.setItemAsync("studentId", `${response.data.student.studentID}`)
              SecureStore.setItemAsync("branchName", `${response.data.branch.branchName}`)
              SecureStore.setItemAsync("fullName", `${response.data.student.studentName}`)
              SecureStore.setItemAsync("email", `${response.data.student.studentEmail}`)
              navigation.replace("StudentMainScreen");
              }
            if(response.data.user.userRole==2){
              SecureStore.setItemAsync("teacherId", `${response.data.teacher.teacherID}`)
              SecureStore.setItemAsync("fullName", `${response.data.teacher.teacherName}`)
              SecureStore.setItemAsync("email", `${response.data.teacher.teacherEmail}`)
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
        // Variable used for checking if user's logged in or not
        const isLoggedin = await SecureStore.getItemAsync("isLoggedin");
        
        if (isLoggedin === "true") {
            // If user's logged in already, refresh current accesss token by using refreshToken in SecureStore
            const refreshToken = await SecureStore.getItemAsync("refreshToken");
            await axios.post(`${BASE_URL}/refresh`,refreshToken
            , {
                params: { 'refresh_token': refreshToken},
              })
              
                .then(function (response) {
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