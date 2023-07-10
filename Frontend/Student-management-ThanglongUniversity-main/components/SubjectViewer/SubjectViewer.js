import {
    StyleSheet, TextInput, View, Text, ScrollView,ActivityIndicator, Platform,Dimensions,
    Image, Keyboard, TouchableOpacity, Modal
  } from "react-native"; import React,{useState,useEffect} from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GlobalStyle from "../../GlobalStyle";
import axios from "axios";
import { BASE_URL } from "../../env/url";
// Get window's width, height to style view
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height
const imgHeight = windowWidth * 4 / 3;

const SubjectViewer = (props) => {
    const { courseID, showModal, onRequestClose } = props; // Props passed from HistoryScreen
// Store base64 used for Image source prop
    const [subjectID, setSubjectID]=useState("")

    const [subjectName, setSubjectName]=useState("")
    const [className, setClassName]=useState("")
    const [courseDate, setCourseDate]=useState("")
    const [courseShiftStart, setCourseShiftStart]=useState("")
    const [courseShiftEnd, setCourseShiftEnd]=useState("")
    const [courseRoom, setCourseRoom]=useState("")
    const [teacherID,setTeacherID]=useState("")
    const [teacherName, setTeacherName]=useState("")
    const load = async(courseID)=>{
        await axios.get(`${BASE_URL}/course/${courseID}`)
          .then(function (response) {
            setSubjectID(response.data.courses[0].subjectID)
            setSubjectName(response.data.courses[0].subjectName)
            setClassName(response.data.courses[0].className)
            setCourseDate(response.data.courses[0].courseDate)
            setCourseShiftStart(response.data.courses[0].courseShiftStart)
            setCourseShiftEnd(response.data.courses[0].courseShiftEnd)
            setCourseRoom(response.data.courses[0].courseRoom)
            setTeacherID(response.data.courses[0].teacherID)
            setTeacherName(response.data.courses[0].teacherName)
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
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:"#00000050"}}>
                  
                    <View style={{ width: '100%',backgroundColor:"white",height:"50%",top:"25%",borderRadius:16}}><View>
                        <TouchableOpacity onPress={onRequestClose} style={{marginLeft:"4%",top:"10%"}}
                        ><FontAwesome5 name='times' size={36} color={GlobalStyle.textColor.color}></FontAwesome5></TouchableOpacity></View>

                        <ScrollView style={{marginLeft:"5%",marginTop:"3%",alignContent:"flex-start"}}>
                        <View style={{flexDirection:"row"}}><Text style={styles.headerText}>Mã môn: </Text><Text style={styles.text}>{subjectID}</Text></View>
                        <View style={{flexDirection:"row"}}><Text style={styles.headerText}>Tên môn: </Text><Text style={styles.text}>{subjectName}</Text></View>
                        <View style={{flexDirection:"row"}}><Text style={styles.headerText}>Tên lớp: </Text><Text style={styles.text}>{className}</Text></View>
                        <View style={{flexDirection:"row"}}><Text style={styles.headerText}>Phòng học: </Text><Text style={styles.text}>{courseRoom}</Text></View>
                        {courseDate===1?(<View style={{flexDirection:"row"}}><Text style={styles.headerText}>Thứ: </Text><Text style={styles.text}>Chủ nhật</Text></View>):(<View style={{flexDirection:"row"}}><Text style={styles.headerText}>Thứ: </Text><Text style={styles.text}>{courseDate}</Text></View>)}
                        <View style={{flexDirection:"row"}}><Text style={styles.headerText}>Ca:  </Text><Text style={styles.text}>{courseShiftStart}-{courseShiftEnd}</Text></View>
                        <View style={{flexDirection:"row"}}><Text style={styles.headerText}>Giáo viên: </Text><Text style={styles.text}>{teacherName}( {teacherID} )</Text></View>
                        </ScrollView>
                    </View>
                </View>
        </Modal>
    )
}

export default SubjectViewer
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