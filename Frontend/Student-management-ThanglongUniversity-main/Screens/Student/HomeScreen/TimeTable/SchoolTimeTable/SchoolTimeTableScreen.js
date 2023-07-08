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
import SubjectViewer from "../../../../../components/SubjectViewer/SubjectViewer";
import Loader from "../../../../../components/Loader/Loader";
import CustomPicker from "../../../../../components/Picker/CustomPicker";
import * as SecureStore from "expo-secure-store";

let windowWidth = Dimensions.get("window").width;

const SchoolTimeTableScreen = () => {
  const [loading, setLoading] = useState(true);
  const [loadingLoader, setLoadingLoader] = useState(true);
  const [dataset, setDataset] = useState([]);
  const [courseID, setCourseID] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [termID, setTermID] = useState("2223HK1N1");
  const [showModal, setShowModal] = useState(false);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, []);

  const load = useCallback(async () => {
  
    try {
       await axios.get(`${BASE_URL}/course`, {
        headers: {
          "Content-Type": "application/json",
          termID: termID,
        },
      })  .then(function (response) {
          setDataset(response.data.courses)
          setRefreshing(false)
          setLoadingLoader(false)        
    })
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
      setLoadingLoader(false);
    }
  }, [termID]);
  
  useEffect(() => {
    load();
  }, [loadingLoader]);

  let closeModal = () => {
    setShowModal(false);
  };

  const filteredDataset = dataset.filter(
    (data) =>
      data.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header hasBackButton={true} title={"Thời khóa biểu toàn trường"} />
      <Loader loading={loadingLoader} />
      <View style={{marginLeft:"15%"}}>
        <CustomPicker
        value={termID}
        onValueChange={(itemValue, itemIndex) => {
          setTermID(itemValue);          
          setRefreshing(true);
          setLoadingLoader(true); // Show loading loader when changing termID
          load().then(() => {
            setLoadingLoader(false);
          });

        }}
        items={[
          { label: "Học kỳ 1 - Nhóm 1 2023 - 2024", value: "2324HK1N1" },
          { label: "Học kỳ 1 - Nhóm 2 2023 - 2024", value: "2324HK1N2" },
          { label: "Học kỳ 3 - Nhóm 1 2022 - 2023", value: "2223HK3N1" },
          { label: "Học kỳ 3 - Nhóm 2 2022 - 2023", value: "2223HK3N2" },
          { label: "Học kỳ 3 - Nhóm 3 2022 - 2023", value: "2223HK3N3" },
          { label: "Học kỳ 2 - Nhóm 1 2022 - 2023", value: "2223HK2N1" },
          { label: "Học kỳ 2 - Nhóm 2 2022 - 2023", value: "2223HK2N2" },
          { label: "Học kỳ 2 - Nhóm 3 2022 - 2023", value: "2223HK2N3" },
          { label: "Học kỳ 1 - Nhóm 1 2022 - 2023 ", value: "2223HK1N1" },
          { label: "Học kỳ 1 - Nhóm 2 2022 - 2023", value: "2223HK1N2" },
          { label: "Học kỳ 1 - Nhóm 3 2022 - 2023", value: "2223HK1N3" },          
        ]}

      />
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View>
        <View style={[styles.tableRow, { backgroundColor: "#f9fafb" }]}>
          <View style={{ width: "8%" }}>
            <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: "center" }]}>
              STT
            </Text>
          </View>
          <View style={{ width: "50%" }}>
            <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: "center" }]}>
              Tên môn
            </Text>
          </View>
          <View style={{ width: "10%" }}>
            <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: "center" }]}>
              Thứ
            </Text>
          </View>
          <View style={{ width: "10%" }}>
            <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: "center" }]}>
              Ca
            </Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: "center" }]}>
              Phòng học
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
                {filteredDataset.length === 0 ? (
                  <Text style={styles.noResultsText}>No results found</Text>
                ) : (
                  filteredDataset?.map((data, index) => {
                    return (
                      <TouchableOpacity
                        key={data.id}
                        style={[
                          styles.tableRow,
                          { backgroundColor: index % 2 === 0 ? "white" : "#f6f6f6", borderColor: "#EAECF0" },
                        ]}
                        onPress={async () => {
                          setCourseID(data.courseID);
                          setShowModal(true);
                        }}
                      >
                        <View style={{ width: "8%", alignSelf: "center", marginRight: "3%" }}>
                          <Text allowFontScaling={false} style={[styles.text]}>
                            {index + 1}
                          </Text>
                        </View>
                        <View style={{ width: "45%", alignSelf: "center", marginRight: "2%" }}>
                          <Text allowFontScaling={false} style={styles.headerText}>
                            {data.subjectName}
                          </Text>
                          <Text allowFontScaling={false} style={styles.text}>
                            {data.className}
                          </Text>
                        </View>
                        <View style={{ width: "10%", alignSelf: "center" }}>
                          <Text allowFontScaling={false} style={styles.text}>
                            {data.courseDate}
                          </Text>
                        </View>
                        <View style={{ width: "10%", alignSelf: "center" }}>
                          <Text allowFontScaling={false} style={styles.text}>
                            {data.courseShiftStart}-{data.courseShiftEnd}
                          </Text>
                        </View>
                        <View style={{ width: "22%", alignSelf: "center" }}>
                          <Text allowFontScaling={false} style={styles.text}>
                            {data.courseRoom}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
              <SubjectViewer courseID={courseID} showModal={showModal} onRequestClose={closeModal} />
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default SchoolTimeTableScreen;

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
  tableHeader: {},
  headerText: {
    color: GlobalStyle.textColor.color,
    fontSize: 12,
    paddingVertical: 6,
    fontWeight: "bold",
    textAlign: "center",
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
    textAlign: "center",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});
