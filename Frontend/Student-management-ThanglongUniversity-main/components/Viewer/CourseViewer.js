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
  Modal,
  TouchableWithoutFeedback,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GlobalStyle from "../../GlobalStyle";
import axios from "axios";
import { BASE_URL } from "../../env/url";
import * as SecureStore from "expo-secure-store";
import CheckBox from "@react-native-community/checkbox";
import CourseRegistrationScreen from "../../Screens/Student/HomeScreen/Registration/CourseRegistration/CourseRegistrationScreen";
import PopupMsgAdd from "../Popup/PopupMsgAdd";
import PopupMsgDelete from "../Popup/PopupMsgDelete";
import { faL } from "@fortawesome/free-solid-svg-icons";
// Get window's width, height to style view
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const imgHeight = (windowWidth * 4) / 3;

const CourseViewer = (props) => {
  const { subjectID, subjectName, termID, showModal, onRequestClose } = props; // Props passed from HistoryScreen
  // Store base64 used for Image source prop
  const [dataCourse, setDataCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [checkBoxChecked, setCheckBoxChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const[courseID,setCourseID]=useState("")
  const [showModalDeny, setShowModalDeny] = useState(false);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [showModalDuplicate,setShowModalDuplicate]=useState(false)

  const handleCloseModal = () => {
    setCheckBoxChecked(false);
    onRequestClose();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };
  const load = async () => {
    const studentID = await SecureStore.getItemAsync("studentId");
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const authorization = `Bearer ${accessToken}`;
    await axios
      .get(
        `${BASE_URL}/courses_by_subject_term/${studentID}/${subjectID}/${termID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
          },
        }
      )
      .then(function (response) {
        const modifiedData = response.data.courses.map((data) => ({
          ...data,
          checked: false, // Initialize the checked property to false for each item
        }));

        setDataCourse(modifiedData);
        setRefreshing(false)
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const updateCheckedItems = useCallback(() => {
    const selectedItems = dataCourse.reduce((selected, data, index) => {
      if (data.checked) {
        selected.push(index);
      }
      return selected;
    }, []);
    setCheckedItems(selectedItems);
  }, [dataCourse]);
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    load();
  }, [subjectID, termID]);

  useEffect(() => {
    updateCheckedItems();
  }, [dataCourse, updateCheckedItems]);
  let closeModalDeny= () => {
    setShowModalDeny(true)
    setTimeout(() => {
      setShowModalDeny(false);
    }, 2000);
  }; 
  let closeModalDuplicate= () => {
    setShowModalDuplicate(true)
    setTimeout(() => {
      setShowModalDuplicate(false);
    }, 2000);
  };
  let closeModalSuccess= () => {
    setShowModalSuccess(true)
    setTimeout(() => {
      setShowModalSuccess(false);
    }, 2000);
  };

  const onCheckBoxPress = async (index) => {
    setDataCourse((prevData) =>
      prevData.map((data, i) => ({
        ...data,
        is_registered: i === index ? !data.is_registered : false,
      }))
    );

    const course = dataCourse[index];
    const studentID = await SecureStore.getItemAsync("studentId");
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const authorization = `Bearer ${accessToken}`;
    
    if (course.is_registered == false) {
      await axios.post(`${BASE_URL}/create_class`,
          {
            studentID: studentID,
            courseID: course.courseID,
            termID: termID,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              "Authorization": authorization,
            },
          }
        )
        .then(function (response) {
          console.log("Đăng ký thành công");
          closeModalSuccess(); // Show the success modal

        })
        .catch(function (error) {
          console.log("trùng lịch")
          if(error.response.status===400){
            closeModalDuplicate()
          }
          console.log(error.response.status);
          console.log(error.response);
        });
    } else {
        await axios.put(`${BASE_URL}/update_class`,
        {
          courseID: course.courseID,
          studentID: studentID,
          termID: termID,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization": authorization,
          },
        }).then(function (response) {
          console.log("Đăng ký thành công");
          closeModalDeny(); // Show the success modal

        })
        .catch(function (error) {
          console.log(error.response.status);
          console.log(error.response);
        });


      console.log("Hủy đăng ký thành công");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
      visible={showModal}
    >
      <TouchableWithoutFeedback
        onPress={handleCloseModal}
        style={{ marginRight: "5%" }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#00000050",
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              height: "45%",
              top: "30%",
              borderRadius: 16,
            }}
          >
            <View>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={{ marginLeft: "90%", top: "10%" }}
              >
                <FontAwesome5
                  name="times"
                  size={36}
                  color={GlobalStyle.textColor.color}
                ></FontAwesome5>
              </TouchableOpacity>
            </View>
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
                  <View style={styles.tableContainer}>
                    {dataCourse.length === 0 ? (
                      <Text
                        style={{
                          color: GlobalStyle.textColor.color,
                          fontSize: 14,
                          textAlign: "center",
                          margin: "5%",
                        }}
                      >
                        Môn {subjectName} không có trong kỳ này
                      </Text>
                    ) : (
                      dataCourse?.map((data, index) => {
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
                            onPress={() => onCheckBoxPress(index)}
                          >
                            <View
                              style={{
                                width: "100%",
                                alignSelf: "center",
                                flexDirection: "row",
                              }}
                            >
                              <CheckBox
                                boxType="square"
                                onAnimationType="bounce"
                                offAnimationType="bounce"
                                animationDuration="0.5"
                                value={data.is_registered} // Use the checked property to set the checkbox state
                                style={{ marginLeft: 15 }}
                              />
                              <Text
                                allowFontScaling={false}
                                style={styles.text}
                              >
                                {data.className} ( Thứ {data.courseDate} [
                                {data.courseShiftStart}-{data.courseShiftEnd}] )
                              </Text>
                            </View>

                          </TouchableOpacity>
                        );
                      })
                    )}
                  </View>
 
                </View>
              )}
            </ScrollView>
          </View>

        </View>
      </TouchableWithoutFeedback>
          <PopupMsgAdd showModal={showModalSuccess} title="Đăng ký môn thành công"/>
          <PopupMsgDelete showModal={showModalDuplicate} title="Trùng lịch"/>
          <PopupMsgDelete showModal={showModalDeny} title="Hủy lớp thành công"/>

    </Modal>
  );
};

export default CourseViewer;
const styles = StyleSheet.create({
  headerText: {
    color: GlobalStyle.textColor.color,
    fontSize: 20,
    paddingVertical: 8,
    fontWeight: "600",
  },
  text: {
    color: GlobalStyle.textColor.color,
    fontSize: 18,
    paddingVertical: 8,
    marginLeft: "5%",
  },
  tableRow: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    flexDirection: "row",
    marginRight: "5%",
  },
});
