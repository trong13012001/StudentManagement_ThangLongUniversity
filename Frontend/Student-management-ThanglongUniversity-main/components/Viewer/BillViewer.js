import {
    StyleSheet, TextInput, View, Text, ScrollView,ActivityIndicator, Platform,Dimensions,
    Image, Keyboard, TouchableOpacity, Modal, TouchableWithoutFeedback
  } from "react-native";
   import React,{useState,useEffect} from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GlobalStyle from "../../GlobalStyle";
import axios from "axios";
import { BASE_URL } from "../../env/url";
import * as SecureStore from "expo-secure-store";

// Get window's width, height to style view
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height
const imgHeight = windowWidth * 4 / 3;

const BillViewer = (props) => {
    const {courseID, showModal, onRequestClose } = props; // Props passed from HistoryScreen
// Store base64 used for Image source prop
    const [subjectID, setSubjectID]=useState("")
    const [subjectName, setSubjectName]=useState("")
    const [quantity, setQuantity]=useState("")
    const [unit, setUnit]=useState("")
    const [bill, setBill]=useState("")
    const [courseShiftEnd, setCourseShiftEnd]=useState("")
    const [courseRoom, setCourseRoom]=useState("")
    const [teacherID,setTeacherID]=useState("")
    const [teacherName, setTeacherName]=useState("")
    const load = async(courseID)=>{
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const authorization = `Bearer ${accessToken}`
        await axios.get(`${BASE_URL}/courseBill/${courseID}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": authorization,
          },
        }
        )
          .then(function (response) {
            setSubjectID(response.data.courses.subjectID)
            setSubjectName(response.data.courses.subjectName)
            setQuantity(response.data.courses.quantity)
            setUnit(response.data.courses.unit)
            setBill(response.data.courses.bill)
          })
          .catch(function (error) {
            console.log(error)
          })  
    }
    useEffect(() => {
        load(courseID);
      }, [courseID])
    return (
        <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={onRequestClose}
            visible={showModal}
            
        >
            <TouchableWithoutFeedback onPress={onRequestClose} style={{marginRight:"5%"}}>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:"#00000050"}}>

                    <View style={{ width: '100%',backgroundColor:"white",height:"35%",top:"35%",borderRadius:16}}><View>
                        <TouchableOpacity onPress={onRequestClose} style={{marginLeft:"90%",top:"10%"}}
                        ><FontAwesome5 name='times' size={36} color={GlobalStyle.textColor.color}></FontAwesome5></TouchableOpacity></View>

                        <ScrollView style={{marginLeft:"5%",marginTop:"3%",alignContent:"flex-start"}}>
                        <View style={{flexDirection:"row"}}><Text style={styles.headerText}>Mã môn: </Text><Text style={styles.text}>{subjectID}</Text></View>
                        <View style={{flexDirection:"row"}}><Text style={styles.headerText}>Tên môn: </Text><Text style={styles.text}>{subjectName}</Text></View>
                        <View style={{flexDirection:"row"}}><Text style={styles.headerText}>Hệ số: </Text><Text style={styles.text}>{parseFloat(quantity).toFixed(1)}</Text></View>
                        <View style={{flexDirection:"row"}}><Text style={styles.headerText}>Đơn giá: </Text><Text style={styles.text}>{unit.toLocaleString()} VND</Text></View>
                        <View style={{flexDirection:"row"}}><Text style={styles.headerText}>Thành tiền: </Text><Text style={styles.text}>{bill.toLocaleString()} VND</Text></View>
                        </ScrollView>
                    </View>

                </View>
                </TouchableWithoutFeedback>

        </Modal>
    )
}

export default BillViewer
const styles = StyleSheet.create({


    headerText: {
      color: GlobalStyle.textColor.color,
      fontSize: 20,
      paddingVertical: 8,
      fontWeight: '600',
    },
    text: {
      color: GlobalStyle.textColor.color,
      fontSize: 20,
      paddingVertical: 8,
      marginRight:"20%"
    },
})