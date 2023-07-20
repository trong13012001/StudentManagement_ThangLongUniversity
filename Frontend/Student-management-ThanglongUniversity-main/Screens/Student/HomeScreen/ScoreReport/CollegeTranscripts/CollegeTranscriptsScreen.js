import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Platform,
  Dimensions,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  StatusBar,
  Button,
  FlatList,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../../../../../env/url";
import Header from "../../../../../components/Header/Header";
import GlobalStyle from "../../../../../GlobalStyle";
import SubjectViewer from "../../../../../components/Viewer/SubjectViewer";
import Loader from "../../../../../components/Loader/Loader";
import CustomPicker from "../../../../../components/Picker/CustomPicker";
import * as SecureStore from "expo-secure-store";
import { useRoute } from '@react-navigation/native';

let windowWidth = Dimensions.get("window").width;

const CollegeTranscriptsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [loadingLoader, setLoadingLoader] = useState(true);
  const [dataset, setDataset] = useState([]);
  const [courseID, setCourseID] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName]=useState("");
  const [studentID,setStudentID]=useState("")
  const [branchName,setBranchName]=useState("")

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, []);

  const load = useCallback(async () => {
  
    try {
        const fullName=await SecureStore.getItemAsync("fullName")
        const studentID=await SecureStore.getItemAsync("studentId")
        const branchName=await SecureStore.getItemAsync("branchName")

        setStudentID(studentID)
        setFullName(fullName)
        setBranchName(branchName)
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const authorization = `Bearer ${accessToken}`
       await axios.get(`${BASE_URL}/get_final_grade_by_student`,
       {headers: {
          "Content-Type": "application/json",
          "Authorization": authorization,
          "studentID":studentID
                },
      })  .then(function (response) {
        console.log(response)

          setDataset(response.data.grades)
          setRefreshing(false)
          setLoadingLoader(false)        
    })
    } catch (error) {
      console.log(error);
      console.log('Response data:', error.response.data);
      console.log('Response status:', error.response.status);
      console.log('Response headers:', error.response.headers);    

      Alert.alert("Error", "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
      setLoadingLoader(false);
    }
  }, []);
  
  useEffect(() => {
    load();
  }, [loadingLoader]);

  let closeModal = () => {
    setShowModal(false);
  };



  return (
    <>
      <Header hasBackButton={true} title={"Bảng điểm"} />
      <Loader loading={loadingLoader} />
      <View style={{marginLeft:"15%"}}>
      <Text allowFontScaling={false} style={styles.header2}><Text style={{textTransform: 'uppercase'}}>{studentID} </Text>{fullName}</Text>
      <Text allowFontScaling={false} style={styles.header3}>Ngành: {branchName}</Text>

      </View>
      <View style={{marginTop:20}}>
        <View style={[styles.tableRow, { backgroundColor: "#f9fafb" }]}>
          <View style={{ width: "8%" }}>
            <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: "center" }]}>
              STT
            </Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text allowFontScaling={false} style={[styles.headerText]}>
              Mã HP
            </Text>
          </View>
          <View style={{ width: "40%" }}>
            <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: "center" }]}>
               Tên HP
            </Text>
          </View>
          <View style={{ width: "15%" }}>
            <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: "center" }]}>
              Số TC
            </Text>
          </View>
          <View style={{ width: "15%" }}>
            <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: "center" }]}>
              Điểm
            </Text>
          </View>
      
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {loading ? (
            <ActivityIndicator
              animating={loading}
              color="gray"
              size="large"
              style={styles.activityIndicator}
            />
          ) : (
            <View>
              <View style={styles.tableContainer}>
                {dataset.length === 0 ? (
                  <Text style={styles.noResultsText}>No results found</Text>
                ) : (
                  dataset?.map((data, index) => {
                    return (
                      <View
                        key={data.id}
                        style={[
                          styles.tableRow,
                          {   backgroundColor: data.finalGrade === -1 ? "green" : (data.finalGrade === null ? "#fafad2" : "white"),
                        },
                        ]}
                      >
                        <View style={{ width: "8%", alignSelf: "center"}}>
                          <Text allowFontScaling={false} style={[styles.text]}>
                            {index + 1}
                          </Text>
                        </View>
                        <View style={{ width: "20%", alignSelf: "center" }}>
                          <Text allowFontScaling={false} style={styles.text}>
                            {data.subjectID}
                          </Text>
                        </View>
                        <View style={{ width: "40%", alignSelf: "center" }}>
                        <Text allowFontScaling={false} style={styles.headerText}>
                            {data.subjectName}
                          </Text>
                        </View>
                        <View style={{ width: "15%", alignSelf: "center" }}>
                          <Text allowFontScaling={false} style={{...styles.text}}>
                            {data.subjectCredit}
                          </Text>
                        </View>
                        <View style={{ width: "15%", alignSelf: "center" }}>
                            {data.finalGrade===null?(<Text allowFontScaling={false} style={{...styles.text,color:GlobalStyle.textColor.color}}>
                            ?
                          </Text>):data.finalGrade<4 &&data.finalGrade>0?
                          (<Text allowFontScaling={false} style={{...styles.text,color:GlobalStyle.themeColor.color}}>
                            {parseFloat(data.finalGrade).toFixed(1)}
                          </Text>):
                        data.finalGrade>=4?
                          (<Text allowFontScaling={false} style={{...styles.text,color:GlobalStyle.textColor.color}}>
                            {parseFloat(data.finalGrade).toFixed(1)}
                          </Text>):
                           (<Text allowFontScaling={false} style={{...styles.text,color:GlobalStyle.textColor.color}}>
                            {data.finalGrade}
                          </Text>)
                          }

                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default CollegeTranscriptsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 0.85,
  },
  searchInput: {
    height: 40,
    width: "90%",
    marginLeft: "5%",
    margin: 10,
    paddingHorizontal: 10,
    borderColor: GlobalStyle.textColor.color,
    borderWidth: 1,
    borderRadius: 8,
  },
  picker: {
    width: "90%",
    marginLeft: "5%",
    marginBottom: 10,
    borderColor: GlobalStyle.textColor.color,
    borderWidth: 1,
    borderRadius: 8,
  },
  headerText: {
    color: GlobalStyle.textColor.color,
    fontSize: 12,
    paddingVertical: 6,
    fontWeight: "600",
    marginLeft: "10%",
    textAlign:"center"

  },
  tableRow: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    flexDirection: "row",
    width: "90%",
    marginLeft: "5%",
  },
  activityIndicator: {
    alignItems: "center",
    justifyContent: "center",
  },
  tableContainer: {
    marginHorizontal: 0,
  },
  text: {
    color: GlobalStyle.textColor.color,
    fontSize: Platform.OS === "ios" && windowWidth > 200 && windowWidth < 380 ? 10 : 12,
    textAlign:"center"
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
  header2:{
    fontSize: (Platform.OS === 'ios' && windowWidth>400) ?20 : 20*(windowWidth/428),
    fontWeight:"600",
    color:GlobalStyle.themeColor.color
  },
  header3:{
    fontSize: (Platform.OS === 'ios' && windowWidth>400) ? 16 : 16*(windowWidth/428),
    fontWeight:"600",
    color:GlobalStyle.textColor.color,
    marginTop:5
  },

});

