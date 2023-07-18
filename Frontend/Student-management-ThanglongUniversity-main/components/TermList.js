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
import Icon1 from 'react-native-vector-icons/SimpleLineIcons';
import { useNavigation,CommonActions } from '@react-navigation/native';
import { BASE_URL } from "../env/url";
import Header from "./Header/Header";
import GlobalStyle from "../GlobalStyle";
import Loader from "./Loader/Loader";
let windowWidth = Dimensions.get("window").width;

const TermList = ({title,name}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [loadingLoader, setLoadingLoader] = useState(true);
  const [dataset, setDataset] = useState([]);
  const [courseID, setCourseID] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [termData,setTermData]=useState([])
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, []);

  const load =useCallback(async () => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const authorization = `Bearer ${accessToken}`
    try {
       await axios.get(`${BASE_URL}/term_list/`,
       {
        headers: {
          "Content-Type": "application/json",
          "Authorization": authorization,
        },
        }).then(function (response) {
          setTermData(response.data.term)
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
  },[termData]);
  
  useEffect(() => {
    load();
  }, [loadingLoader]);


  const filteredDataset = termData.filter(
    (data) =>
      data.termID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.termName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header hasBackButton={true} title={title} />
      <Loader loading={loadingLoader} />
      <Text allowFontScaling={false} style={styles.header2}>Chọn học kỳ</Text>

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
                    filteredDataset.sort((a, b) => {
                        return new Date(b.id) - new Date(a.id);
                      })?.map((data, index) => {
                    return (
                      <TouchableOpacity
                        key={data.id}
                        style={[
                          styles.tableRow,
                          { backgroundColor: index % 2 === 0 ? "white" : "#f6f6f6", borderColor: "#EAECF0" },
                        ]}
                        onPress={async () => {
                        navigation.navigate(name, { data });
                        }}
                      >
                        <View style={{ width: "80%", alignSelf: "center", marginRight: "2%" }}>
                          <Text allowFontScaling={false} style={styles.text}>
                            {data.termName}
                          </Text>
                        </View>
                        <View
                            style={{
                              width: '30%',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}
                          >
                          <Icon1
                            name="arrow-right"
                            size={15}
                            style={{
                              position: 'absolute',
                              alignSelf: 'center', 
                              color: GlobalStyle.textColor.color,
                            }}
                          />
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
    </>
  );
};

export default TermList;

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
    fontSize: Platform.OS === "ios" && windowWidth > 200 && windowWidth < 380 ? 14 : 16,
    paddingVertical:10
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
  header2:{
    fontSize: (Platform.OS === 'ios' && windowWidth>400) ? 24 : 24*(windowWidth/428),
    fontWeight:"600",
    color:GlobalStyle.themeColor.color, 
    marginLeft:"15%",
    marginBottom:"3%"
  }
});
