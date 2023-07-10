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
import { BASE_URL } from "../../../../env/url";
import Header from "../../../../components/Header/Header";
import GlobalStyle from "../../../../GlobalStyle";
import SubjectViewer from "../../../../components/SubjectViewer/SubjectViewer";
import Loader from "../../../../components/Loader/Loader";
import CustomPicker from "../../../../components/Picker/CustomPicker";
import * as SecureStore from "expo-secure-store";
import { useRoute } from '@react-navigation/native';

let windowWidth = Dimensions.get("window").width;

const EducationProgramScreen = () => {
    const route = useRoute();
    const branchID = route.params.dataUser; 
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
       await axios.get(`${BASE_URL}/get_subject_by_branch/${branchID}`)
         .then(function (response) {
          setDataset(response.data.subject)
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
      data.subjectId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header hasBackButton={true} title={"Thời khóa biểu toàn trường"} />
      <Loader loading={loadingLoader} />
      <View style={{marginLeft:"15%"}}>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View>
        <View style={[styles.tableRow, { backgroundColor: "#f9fafb" }]}>
          <View style={{ width: "10%" }}>
            <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: "center" }]}>
              STT
            </Text>
          </View>
          <View style={{ width: "30%" }}>
            <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: "center" }]}>
              Mã Môn
            </Text>
          </View>
          <View style={{ width: "45%" }}>
            <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: "center" }]}>
              Tên Môn
            </Text>
          </View>
          <View style={{ width: "15%" }}>
            <Text allowFontScaling={false} style={[styles.headerText, { alignSelf: "center" }]}>
              Tín chỉ
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
                      <View
                        key={data.id}
                        style={[
                          styles.tableRow,
                          { backgroundColor: index % 2 === 0 ? "white" : "#f6f6f6", borderColor: "#EAECF0" },
                        ]}
                      >
                        <View style={{ width: "10%", alignSelf: "center" }}>
                          <Text allowFontScaling={false} style={[styles.text]}>
                            {index + 1}
                          </Text>
                        </View>
                        <View style={{ width: "30%", alignSelf: "center" }}>
                          <Text allowFontScaling={false} style={styles.headerText}>
                            {data.subjectId}
                          </Text>
                        </View>
                        <View style={{ width: "45%", alignSelf: "center" }}>
                        <Text allowFontScaling={false} style={styles.text}>
                            {data.subjectName}
                          </Text>
                        </View>
                        <View style={{ width: "15%", alignSelf: "center" }}>
                          <Text allowFontScaling={false} style={styles.text}>
                            {data.credit}
                          </Text>
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

export default EducationProgramScreen;

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
    textAlign:"center"
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});
