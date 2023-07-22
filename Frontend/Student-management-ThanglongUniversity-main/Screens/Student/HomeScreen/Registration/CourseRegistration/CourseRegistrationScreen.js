import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Dimensions,
  Platform,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import GlobalStyle from "../../../../../GlobalStyle";
import { faL } from "@fortawesome/free-solid-svg-icons";
const statusBarStyle = Platform.OS === "ios" ? "dark-content" : "light-content";
let windowWidth = Dimensions.get("window").width;
import axios from "axios";
import { BASE_URL } from "../../../../../env/url";
import * as SecureStore from "expo-secure-store";
import CustomPicker from "../../../../../components/Picker/CustomPicker";
import SubjectViewer from "../../../../../components/Viewer/SubjectViewer";
import Header from "../../../../../components/Header/Header";
import CourseViewer from "../../../../../components/Viewer/CourseViewer";
const CourseRegistrationScreen = () => {
  const [isMondayPressed, setIsMondayPressed] = useState(true);
  const [isTuesdayPressed, setIsTuesdayPressed] = useState(false);
  const [isWednesdayPressed, setIsWednesdayPressed] = useState(false);
  const [isThurdayPressed, setIsThurdayPressed] = useState(false);
  const [isFridayPressed, setIsFridayPressed] = useState(false);
  const [isSaturdayPressed, setIsSaturdayPressed] = useState(false);
  const [isSundayPressed, setIsSundayPressed] = useState(false);
  const [term, setTerm] = useState("");
  const [currentTermName, setCurrentTermName] = useState("");
  const [currentTermId, setCurrentTermID] = useState("");
  const scrollViewRef = useRef(null);
  const [termID, setTermID] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingLoader, setLoadingLoader] = useState(true);
  const [listTerm, setListTerm] = useState([]);
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const [date, setDate] = useState(currentDay);
  const [listTimeTableDay, setListTimeTableDay] = useState([]);
  const [courseID, setCourseID] = useState("");
  const [selectDate, setSelectDate] = useState("");
  const [dataUnlearnSubject, setDataUnlearnSubject] = useState([]);
  const [subjectID, setSubjectID] = useState("");
  const [showModalSubject, setShowModalSubject] = useState(false);
  const [showModalCourse, setShowModalCourse] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    unLearnSubject();
    currentTerm();
    listTermStudy();
  }, []);
  const getTimeTableDay = async (value, selectedTerm) => {
    console.log("Thứ", value);
    console.log("Học kỳ", selectedTerm);
    setSelectDate(value);
    const studentID = await SecureStore.getItemAsync("studentId");
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const authorization = `Bearer ${accessToken}`;
    try {
      await axios
        .get(
          `${BASE_URL}/class_by_student/${value}?studentID=${studentID}&termID=${currentTermId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: authorization,
            },
          }
        )
        .then(function (response) {
          const filteredData = response.data.dateSchedule.filter(item => item.status === 1);
          setListTimeTableDay(filteredData);
          setRefreshing(false);
          setLoadingLoader(false);
        });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
      setLoadingLoader(false);
    }
  };

  const unLearnSubject = async () => {
    const studentID = await SecureStore.getItemAsync("studentId");

    const accessToken = await SecureStore.getItemAsync("accessToken");
    const authorization = `Bearer ${accessToken}`;
    try {
      await axios
        .get(`${BASE_URL}/unlearned_subject/${currentTermId}/${studentID}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
          },
        })
        .then(function (response) {
          setDataUnlearnSubject(response.data.unlearnedSubject);
          setRefreshing(false);
          setLoadingLoader(false);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setLoadingLoader(false);
    }
  };
  const currentTerm = async () => {
    const studentID = await SecureStore.getItemAsync("studentId");

    const accessToken = await SecureStore.getItemAsync("accessToken");
    const authorization = `Bearer ${accessToken}`;
    try {
      await axios
        .get(`${BASE_URL}/current_term/${studentID}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
          },
        })
        .then(function (response) {
          setCurrentTermName(response.data.termName);
          setCurrentTermID(response.data.termID);
          setRefreshing(false);
          setLoadingLoader(false);
        });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
      setLoadingLoader(false);
    }
  };
  const listTermStudy = async () => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const authorization = `Bearer ${accessToken}`;
    try {
      await axios
        .get(`${BASE_URL}/term_list/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
          },
        })
        .then(function (response) {
          setListTerm(response.data.term);
          setRefreshing(false);
          setLoadingLoader(false);
        });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
      setLoadingLoader(false);
    }
  };
  useEffect(() => {
    unLearnSubject();
    if (currentDay === 1) {
      handleMondayPress();
    }
    if (currentDay === 2) {
      handleTuesdayPress();
    }
    if (currentDay === 3) {
      handleWednesdayPress();
    }
    if (currentDay === 4) {
      handleThurdayPress();
    }
    if (currentDay === 5) {
      handleFridayPress();
    }
    if (currentDay === 6) {
      handleSaturdayPress();
    }
    if (currentDay === 0) {
      handleSundayPress();
    }
    currentTerm();
    listTermStudy();
  }, [currentTermId]);
  const handleMondayPress = () => {
    setIsMondayPressed(!isMondayPressed);
    setIsMondayPressed(true);
    setIsTuesdayPressed(false);
    setIsWednesdayPressed(false);
    setIsThurdayPressed(false);
    setIsFridayPressed(false);
    setIsSaturdayPressed(false);
    setIsSundayPressed(false);
    getTimeTableDay(2, termID);
  };
  const handleTuesdayPress = () => {
    setIsTuesdayPressed(!isTuesdayPressed);
    setIsMondayPressed(false);
    setIsTuesdayPressed(true);
    setIsWednesdayPressed(false);
    setIsThurdayPressed(false);
    setIsFridayPressed(false);
    setIsSaturdayPressed(false);
    setIsSundayPressed(false);
    getTimeTableDay(3, termID);
  };
  const handleWednesdayPress = () => {
    setIsWednesdayPressed(!isWednesdayPressed);
    setIsMondayPressed(false);
    setIsTuesdayPressed(false);
    setIsWednesdayPressed(true);
    setIsThurdayPressed(false);
    setIsFridayPressed(false);
    setIsSaturdayPressed(false);
    setIsSundayPressed(false);
    getTimeTableDay(4, termID);
    scrollViewRef.current.scrollTo({ x: 0, animated: true });
  };
  const handleThurdayPress = () => {
    setIsThurdayPressed(!isThurdayPressed);
    setIsMondayPressed(false);
    setIsTuesdayPressed(false);
    setIsWednesdayPressed(false);
    setIsThurdayPressed(true);
    setIsFridayPressed(false);
    setIsSaturdayPressed(false);
    setIsSundayPressed(false);
    getTimeTableDay(5, termID);
    scrollViewRef.current.scrollTo({ x: 400, animated: true });
  };
  const handleFridayPress = () => {
    setIsFridayPressed(!isFridayPressed);
    setIsMondayPressed(false);
    setIsTuesdayPressed(false);
    setIsWednesdayPressed(false);
    setIsThurdayPressed(false);
    setIsFridayPressed(true);
    setIsSaturdayPressed(false);
    setIsSundayPressed(false);
    getTimeTableDay(6, termID);
    scrollViewRef.current.scrollTo({ x: 500, animated: false });
  };
  const handleSaturdayPress = () => {
    setIsSaturdayPressed(!isSaturdayPressed);
    setIsMondayPressed(false);
    setIsTuesdayPressed(false);
    setIsWednesdayPressed(false);
    setIsThurdayPressed(false);
    setIsFridayPressed(false);
    setIsSaturdayPressed(true);
    setIsSundayPressed(false);
    getTimeTableDay(7, termID);
    scrollViewRef.current.scrollTo({ x: 500, animated: false });
  };
  const handleSundayPress = () => {
    setIsSundayPressed(!isSundayPressed);
    setIsMondayPressed(false);
    setIsTuesdayPressed(false);
    setIsWednesdayPressed(false);
    setIsThurdayPressed(false);
    setIsFridayPressed(false);
    setIsSaturdayPressed(false);
    setIsSundayPressed(true);
    getTimeTableDay(1, termID);
    scrollViewRef.current.scrollTo({ x: 500, animated: false });
  };
  let closeModalSubject = () => {
    setShowModalSubject(false);
  };
  let closeModalCourse = () => {
    setShowModalCourse(false);
  };
  return (
    <>
      <StatusBar barStyle={statusBarStyle} />
      <Header title={"Đăng ký học"} hasBackButton={true} />

      <View style={{ marginLeft: "5%" }}>
        <View style={{ marginLeft: "10%" }}>
          <Text style={{ ...styles.header2 }}>{currentTermName}</Text>
        </View>
        <View style={{ height: "35%", marginTop: 15 }}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
                {currentTermId === undefined ? (
                      <Text style={{...styles.text,marginLeft:"30%"}}>Hết thời gian đăng ký</Text>
                      ) : (
                  <View style={styles.tableContainer}>
                    {dataUnlearnSubject.length === 0 ? (
                      <Text style={{...styles.text,marginLeft:"30%"}}>Hết thời gian đăng ký</Text>
                    ) : (
                      dataUnlearnSubject?.map((data, index) => {
                        return (
                          <TouchableOpacity
                            key={data.id}
                            style={[
                              styles.tableRow,
                              {
                                backgroundColor:
                                  index % 2 === 0 ? "white" : "#f6f6f6",
                                borderColor: "#EAECF0",
                              },
                            ]}
                            onPress={async () => {
                              setSubjectName(data.subjectName);
                              setSubjectID(data.subjectID);
                              setShowModalCourse(true);
                            }}
                          >
                            <View
                              style={{
                                width: "90%",
                                alignSelf: "center",
                                marginRight: "2%",
                              }}
                            >
                              <Text
                                allowFontScaling={false}
                                style={styles.headerText}
                              >
                                {data.subjectName}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })
                    )}
                  </View>
                )}

                <CourseViewer
                  subjectID={subjectID}
                  subjectName={subjectName}
                  termID={currentTermId}
                  showModal={showModalCourse}
                  onRequestClose={closeModalCourse}
                />
              </View>
            )}
          </ScrollView>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={{
            flexDirection: "row",
            marginRight: "5%",
            height: "5%",
            marginTop: 10,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            style={{
              width: 80,
              ...styles.wrapper,
              backgroundColor: isMondayPressed ? "#FBD7DA" : "#DfDfDf",
            }}
            onPress={handleMondayPress}
          >
            <Text allowFontScaling={false} style={styles.header3}>
              Thứ 2
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 80,
              ...styles.wrapper,
              backgroundColor: isTuesdayPressed ? "#FBD7DA" : "#DfDfDf",
            }}
            onPress={handleTuesdayPress}
          >
            <Text allowFontScaling={false} style={styles.header3}>
              Thứ 3
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 80,
              ...styles.wrapper,
              backgroundColor: isWednesdayPressed ? "#FBD7DA" : "#DfDfDf",
            }}
            onPress={handleWednesdayPress}
          >
            <Text allowFontScaling={false} style={styles.header3}>
              Thứ 4
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 80,
              ...styles.wrapper,
              backgroundColor: isThurdayPressed ? "#FBD7DA" : "#DfDfDf",
            }}
            onPress={handleThurdayPress}
          >
            <Text allowFontScaling={false} style={styles.header3}>
              Thứ 5
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 80,
              ...styles.wrapper,
              backgroundColor: isFridayPressed ? "#FBD7DA" : "#DfDfDf",
            }}
            onPress={handleFridayPress}
          >
            <Text allowFontScaling={false} style={styles.header3}>
              Thứ 6
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 80,
              ...styles.wrapper,
              backgroundColor: isSaturdayPressed ? "#FBD7DA" : "#DfDfDf",
            }}
            onPress={handleSaturdayPress}
          >
            <Text allowFontScaling={false} style={styles.header3}>
              Thứ 7
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 80,
              ...styles.wrapper,
              backgroundColor: isSundayPressed ? "#FBD7DA" : "#DfDfDf",
            }}
            onPress={handleSundayPress}
          >
            <Text allowFontScaling={false} style={styles.header3}>
              Chủ nhật
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={{ height: "30%",marginBottom:"55%" }}>
          <ScrollView style={{ marginTop: "2%" }}>
            {listTimeTableDay.length === 0 ? (
              <Text style={{ ...styles.text, textAlign: "center" }}>
                {selectDate === 1
                  ? "Bạn không có môn học nào vào Chủ nhật"
                  : "Bạn không có môn học nào vào thứ " + selectDate}
              </Text>
            ) : (
              listTimeTableDay.sort((a, b) => {
                return  a.courseShiftStart - b.courseShiftStart;
              })?.map((data, index) => {
                return (
                  <TouchableOpacity
                    key={data.id}
                    style={[
                      styles.tableRow,
                      {
                        backgroundColor: index % 2 === 0 ? "white" : "#f6f6f6",
                        borderColor: "#EAECF0",
                      },
                    ]}
                    onPress={async () => {
                      setCourseID(data.courseID);
                      setShowModalSubject(true);
                    }}
                  >
                    <View
                      style={{
                        width: "30%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{
                          color: GlobalStyle.textColor.color,
                          fontSize:
                            Platform.OS === "ios" &&
                            windowWidth > 200 &&
                            windowWidth < 380
                              ? 20
                              : 24,
                          fontWeight: "600",
                        }}
                      >
                        {data.courseRoom}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "70%",
                        alignSelf: "flex-start",
                        marginLeft: "5%",
                        flexDirection: "column",
                      }}
                    >
                      <Text allowFontScaling={false} style={styles.headerText}>
                        Tên môn: {data.subjectName}
                      </Text>
                      <Text allowFontScaling={false} style={styles.headerText}>
                        Ca: {data.courseShiftStart}-{data.courseShiftEnd}
                      </Text>
                      <Text allowFontScaling={false} style={styles.text}>
                        Mã môn: {data.className}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
          <SubjectViewer
            courseID={courseID}
            showModal={showModalSubject}
            onRequestClose={closeModalSubject}
          />
        </View>
      </View>
    </>
  );
};

export default CourseRegistrationScreen;
const styles = StyleSheet.create({
  header: {
    fontSize:
      Platform.OS === "ios" && windowWidth > 400
        ? 36
        : 36 * (windowWidth / 428),
    fontWeight: "600",
    color: GlobalStyle.textColor.color,
  },
  header2: {
    fontSize:
      Platform.OS === "ios" && windowWidth > 400
        ? 24
        : 24 * (windowWidth / 428),
    fontWeight: "600",
    color: GlobalStyle.themeColor.color,
  },
  header3: {
    fontSize:
      Platform.OS === "ios" && windowWidth > 400
        ? 14
        : 14 * (windowWidth / 428),
    fontWeight: "600",
    color: GlobalStyle.textColor.color,
  },
  wrapper: {
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  headerText: {
    color: GlobalStyle.textColor.color,
    fontSize: 16,
    paddingVertical: 6,
    fontWeight: "600",
  },
  text: {
    color: GlobalStyle.textColor.color,
    paddingVertical: 6,
    fontSize:
      Platform.OS === "ios" && windowWidth > 200 && windowWidth < 380 ? 14 : 16,
  },
  tableRow: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    flexDirection: "row",
    marginRight: "5%",
  },
});
