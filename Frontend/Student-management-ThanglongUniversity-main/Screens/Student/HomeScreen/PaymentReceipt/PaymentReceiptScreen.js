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
import * as SecureStore from "expo-secure-store";
import { useRoute } from "@react-navigation/native";
import { BASE_URL } from "../../../../env/url";
import Header from "../../../../components/Header/Header";
import GlobalStyle from "../../../../GlobalStyle";
import SubjectViewer from "../../../../components/Viewer/SubjectViewer";
import Loader from "../../../../components/Loader/Loader";
import BillViewer from "../../../../components/Viewer/BillViewer";
let windowWidth = Dimensions.get("window").width;

const PaymentReceiptScreen = () => {
  const route = useRoute();
  const dataTerm = route.params.data;
  const [loading, setLoading] = useState(true);
  const [loadingLoader, setLoadingLoader] = useState(true);
  const [dataset, setDataset] = useState([]);
  const [courseID, setCourseID] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [studentID, setStudentID] = useState("");
  const [fullName, setFullName] = useState("");
  const [totalBill, setTotalBill] = useState("");
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getCourseBill();
    getTotalCourseBill();
  }, []);

  const getTotalCourseBill = useCallback(async () => {
    const studentID = await SecureStore.getItemAsync("studentId");
    const fullName = await SecureStore.getItemAsync("fullName");
    setStudentID(studentID);
    setFullName(fullName);
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const authorization = `Bearer ${accessToken}`;
    try {
      await axios
        .get(`${BASE_URL}/bill_by_term/${studentID}/${dataTerm.termID}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
          },
        })
        .then(function (response) {
          setTotalBill(response.data.bills.termSum);
          setRefreshing(false);
          setLoadingLoader(false);
        });
    } catch (error) {
      console.log("bill_by_term", error);
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
      console.log("Response headers:", error.response.headers);

      Alert.alert("Error", "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
      setLoadingLoader(false);
    }
  }, [dataTerm.termID]);
  const getCourseBill = useCallback(async () => {
    const studentID = await SecureStore.getItemAsync("studentId");
    const fullName = await SecureStore.getItemAsync("fullName");
    setStudentID(studentID);
    setFullName(fullName);
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const authorization = `Bearer ${accessToken}`;
    try {
      await axios
        .get(`${BASE_URL}/bill_by_subject/${studentID}/${dataTerm.termID}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
          },
        })
        .then(function (response) {
          setDataset(response.data.bills);
          setRefreshing(false);
          setLoadingLoader(false);
        });
    } catch (error) {
      console.log("bill_by_subject", error);
      console.log("Response data:", error.response.data);
      console.log("Response status:", error.response.status);
      console.log("Response headers:", error.response.headers);

      Alert.alert("Error", "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
      setLoadingLoader(false);
    }
  }, [dataTerm.termID]);

  useEffect(() => {
    getCourseBill();
    getTotalCourseBill();
  }, [loadingLoader]);

  let closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Header hasBackButton={true} title={"Phiếu báo thu tiền"} />
      <Loader loading={loadingLoader} />
      <View style={{ marginLeft: "15%" }}>
        <Text allowFontScaling={false} style={styles.header2}>
          {dataTerm.termName}
        </Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <View style={[styles.tableRow, { backgroundColor: "#f9fafb" }]}>
          <View style={{ width: "50%" }}>
            <Text allowFontScaling={false} style={[styles.headerText1]}>
              Mã sinh viên
            </Text>
          </View>
          <View style={{ width: "1%" }}>
            <Text allowFontScaling={false} style={[styles.headerText1]}>
              :
            </Text>
          </View>
          <View style={{ width: "50%" }}>
            <Text
              allowFontScaling={false}
              style={[styles.headerText1, { textTransform: "capitalize" }]}
            >
              {studentID}
            </Text>
          </View>
        </View>
        <View style={[styles.tableRow, { backgroundColor: "#f9fafb" }]}>
          <View style={{ width: "50%" }}>
            <Text allowFontScaling={false} style={[styles.headerText1]}>
              Họ tên
            </Text>
          </View>
          <View style={{ width: "1%" }}>
            <Text allowFontScaling={false} style={[styles.headerText]}>
              :
            </Text>
          </View>
          <View style={{ width: "50%" }}>
            <Text
              allowFontScaling={false}
              style={[styles.headerText1, { textTransform: "capitalize" }]}
            >
              {fullName}
            </Text>
          </View>
        </View>
        <View style={[styles.tableRow, { backgroundColor: "#f9fafb" }]}>
          <View style={{ width: "50%" }}>
            <Text allowFontScaling={false} style={[styles.headerText1]}>
              Tổng tiền học
            </Text>
          </View>
          <View style={{ width: "1%" }}>
            <Text allowFontScaling={false} style={[styles.headerText]}>
              :
            </Text>
          </View>
          <View style={{ width: "50%" }}>
            <Text allowFontScaling={false} style={[styles.headerText1]}>
              {totalBill.toLocaleString()} VND
            </Text>
          </View>
        </View>
        <View style={[styles.tableRow, { backgroundColor: "#f9fafb" }]}>
          <View style={{ width: "50%" }}>
            <Text allowFontScaling={false} style={[styles.headerText1]}>
              Tình trạng
            </Text>
          </View>
          <View style={{ width: "1%" }}>
            <Text allowFontScaling={false} style={[styles.headerText]}>
              :
            </Text>
          </View>
          <View style={{ width: "50%" }}>
            <Text
              allowFontScaling={false}
              style={[styles.headerText1, { textTransform: "capitalize" }]}
            ></Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <View style={[styles.tableRow, { backgroundColor: "#f9fafb" }]}>
          <View style={{ width: "8%" }}>
            <Text
              allowFontScaling={false}
              style={[styles.headerText, { alignSelf: "center" }]}
            >
              STT
            </Text>
          </View>
          <View style={{ width: "45%" }}>
            <Text
              allowFontScaling={false}
              style={[styles.headerText, { alignSelf: "center" }]}
            >
              Tên môn
            </Text>
          </View>
          <View style={{ width: "40%" }}>
            <Text
              allowFontScaling={false}
              style={[styles.headerText, { alignSelf: "center" }]}
            >
              Học phí
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
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
                {dataset.length === 0 ? (
                  <Text style={styles.noResultsText}>No results found</Text>
                ) : (
                  dataset?.map((data, index) => {
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
                          setCourseID(data.courseID);
                          setShowModal(true);
                        }}
                      >
                        <View
                          style={{
                            width: "8%",
                            alignSelf: "center",
                            marginRight: "3%",
                          }}
                        >
                          <Text allowFontScaling={false} style={[styles.text]}>
                            {index + 1}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: "40%",
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
                          <Text allowFontScaling={false} style={styles.text}>
                            ({data.subjectID})
                          </Text>
                        </View>
                        <View style={{ width: "40%", alignSelf: "center" }}>
                          <Text allowFontScaling={false} style={styles.text}>
                            {data.bill.toLocaleString()} VND
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
              <BillViewer
                courseID={courseID}
                showModal={showModal}
                onRequestClose={closeModal}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default PaymentReceiptScreen;

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
    textAlign: "center",
  },
  headerText1: {
    color: GlobalStyle.textColor.color,
    fontSize: 14,
    paddingVertical: 6,
    fontWeight: "600",
    marginLeft: "2%",
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
    fontSize:
      Platform.OS === "ios" && windowWidth > 200 && windowWidth < 380 ? 10 : 12,
    textAlign: "center",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
  header2: {
    fontSize:
      Platform.OS === "ios" && windowWidth > 400
        ? 20
        : 20 * (windowWidth / 428),
    fontWeight: "600",
    color: GlobalStyle.themeColor.color,
  },
});
