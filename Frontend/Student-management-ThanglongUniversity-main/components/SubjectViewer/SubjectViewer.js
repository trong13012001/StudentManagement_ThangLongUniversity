import {
    StyleSheet, TextInput, View, Text, ScrollView,ActivityIndicator, Platform,Dimensions,
    Image, Keyboard, TouchableOpacity, Modal
  } from "react-native"; import React from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GlobalStyle from "../../GlobalStyle";

// Get window's width, height to style view
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height
const imgHeight = windowWidth * 4 / 3;

const SubjectViewer = (props) => {
    const { subjectID,subjectName,className,courseDate,courseShiftStart,courseShiftEnd,teacherID,teacherName, showModal, onRequestClose } = props; // Props passed from HistoryScreen
// Store base64 used for Image source prop
    return (
        <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={onRequestClose}
            visible={showModal}
            hardwareAccelerated={true}
            
        >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{ width: '100%',backgroundColor:"white",height:"100%",top:"10%",borderRadius:16}}><View>
                        <TouchableOpacity onPress={onRequestClose} style={{marginLeft:"4%",top:"10%"}}><FontAwesome5 name='times' size={36} color={GlobalStyle.textColor.color}></FontAwesome5></TouchableOpacity></View>
                        <View style={{marginLeft:"5%",marginTop:"3%"}}>
                        <Text style={styles.headerText}>Mã môn: {subjectID}</Text>
                        <Text style={styles.headerText}>Tên môn: {subjectName}</Text>
                        <Text style={styles.headerText}>Tên lớp: {className}</Text>
                        <Text style={styles.headerText}>Thứ: {courseDate}</Text>
                        <Text style={styles.headerText}>Ca: {courseShiftStart}-{courseShiftEnd}</Text>
                        <Text style={styles.headerText}>Giáo viên: {teacherName}( {teacherID} )</Text>
                        </View>
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
      fontWeight: 'bold',
      textAlign:"center"
    },
})