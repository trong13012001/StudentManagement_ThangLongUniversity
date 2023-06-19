import React, { useState, useEffect,useRef, useCallback  } from "react";

import {
    StyleSheet, TextInput, View, Text, ScrollView,ActivityIndicator, Platform,Dimensions,
    Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert,StatusBar, Button,FlatList,RefreshControl
  } from "react-native"; 
import axios from "axios";
import { BASE_URL } from "../../../../../env/url"; 
import Header from "../../../../../components/Header/Header";
import GlobalStyle from "../../../../../GlobalStyle";

let windowWidth = Dimensions.get('window').width;


const SchoolTimeTableScreen=()=>{
    const [loading, setLoading] = useState(true);
    const [dataset, setDataset] = useState([]) // State use for storing history data from API
    const [refreshing, setRefreshing] = useState(false); // State use for displaying refresh animation
    const [termID,setTermID]=useState("2223HK1N1")
    const onRefresh = useCallback(() => {
      setRefreshing(true);
      load();
    }, []);
      const load = async () => {
    
        // Calling API
        await axios.get(`${BASE_URL}/course`,
        {
          headers: {
            "Content-Type": "application/json",
            "termID": termID,
          },
        })
          .then(function (response) {
            setRefreshing(false);
            setLoading(false);
            setDataset(response.data.courses)        
          })
          .catch(function (error) {
           setRefreshing(false);
            setLoading(false);
          })
      }

      useEffect(() => {
        load();
      }, [refreshing])
    return(
        <><Header hasBackButton={true} title={"Thời khóa biểu toàn trường"}></Header>

    <View>
      <View style={[styles.tableRow, { backgroundColor: '#f9fafb'}]}>
        <View style={{ width: '8%' }}>
          <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: 'center' }]}>STT</Text>
        </View>
        <View style={{ width: '50%' }}>
          <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: 'center' }]}>Tên môn</Text>
        </View>
        <View  style={{ width: '10%' }}>
          <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: 'center' }]}>Thứ</Text>
        </View>
        <View  style={{ width: '10%' }}>
          <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: 'center' }]}>Ca</Text>
        </View>
        <View style={{ width: '20%'}}>
          <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: 'center' }]}>Phòng học</Text>
        </View>
      </View>
    </View>
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh} />}
      >
        
        {loading ? (<ActivityIndicator
          animating={loading}
          color="gray"
          size="large"
          style={styles.activityIndicator} />) : (
          <View>

          <View style={styles.tableContainer}>
              {dataset.map((data, index) => {
                return (
                  <TouchableOpacity
                    key={data.id}
                    style={[styles.tableRow, {  backgroundColor: index % 2 === 0 ? 'white' : '#f6f6f6',borderColor:"#EAECF0" }]}>
                    <View style={{ width: '8%', alignSelf: 'center',marginRight:"3%"}}>
                      <Text allowFontScaling={false} style={[styles.text]}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={{ width: '45%', alignSelf: 'center',marginRight:"2%" }}>
                    <Text allowFontScaling={false} style={styles.text}>
                      {data.subjectName}
                      </Text>
                      <Text allowFontScaling={false} style={styles.text}>
                      {data.className}
                      </Text>
                    </View>
                    <View style={{ width: '10%', alignSelf: 'center' }}>
                    <Text allowFontScaling={false} style={styles.text}>
                      {data.courseDate}
                      </Text>
                    </View>
                    <View style={{ width: '10%', alignSelf: 'center' }}>
                    <Text allowFontScaling={false} style={styles.text}>
                      {data.courseShiftStart}-{data.courseShiftEnd}
                      </Text>
                    </View>
                    <View style={{ width: '22%', alignSelf: 'center' }}>
                    <Text allowFontScaling={false} style={styles.text}>
                      {data.courseRoom}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View></>
    )
}
export default SchoolTimeTableScreen
const styles = StyleSheet.create({
    container: {
      flex: 0.85,
    },
  
    tableHeader: {
      // alignItems: 'center',
      // borderBottomWidth: 1,
      // borderColor: 'gray',
      // backgroundColor: '#495057',
    },
    headerText: {
      color: GlobalStyle.textColor.color,
      fontSize: 12,
      paddingVertical: 8,
      fontWeight: 'bold',
      textAlign:"center"
    },
    tableRow: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        flexDirection: 'row',
        width:"90%",
        marginLeft: "5%",


      },
      activityIndicator: {
        alignItems: 'center',
        justifyContent: 'center'
      },
      tableContainer: {
        marginHorizontal: 0,
      },
        text: {
        color: GlobalStyle.textColor.color,
        fontSize: (Platform.OS === 'ios' && windowWidth >200 && windowWidth<380 ) ?10:12,
        textAlign:"center"
      },
})