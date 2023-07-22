import React, { useState, useEffect } from "react";
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
  Button,
  FlatList,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../../../../env/url";
import * as SecureStore from "expo-secure-store";
import Icon1 from "react-native-vector-icons/Ionicons";
import GlobalStyle from "../../../../GlobalStyle";
import { CommonActions } from "@react-navigation/native";
import Header from "../../../../components/Header/Header";
const InformationScreen = () => {
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [emailStudent, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [K, setK] = useState("");
  const [group, setGroup] = useState("");
  const [major, setMajor] = useState("");
  const [branch, setBranch] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [b64, setB64] = useState("");

  const load = async () => {
    // Variables used for calling API....
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const authorization = `Bearer ${accessToken}`;

    // Calling API
    await axios
      .get(`${BASE_URL}/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      })
      .then(function (response) {
        setUserID(response.data.student.studentID);
        setUserName(response.data.student.studentName);
        setGender(response.data.student.studentGender);
        setK(response.data.student.studentK);
        setGroup(response.data.student.group);
        setB64(response.data.image);
        setPhone(response.data.student.studentPhone);
        setEmail(response.data.user.userEmail);
        setMajor(response.data.major);
        setBranch(response.data.branch.branchName);
        setAddress(response.data.student.studentAddress);
        setStatus(response.data.student.status);

        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  // Call load() function on the first rendering
  useEffect(() => {
    load();
  }, []);
  const renderItem = ({ item }) => (
    <View style={styles.itemwrapper}>
      <View style={[styles.item]}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: GlobalStyle.textColor.color,
            width: "37%",
          }}
        >
          {item.title}
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: GlobalStyle.textColor.color,
          }}
        >
          {item.content}
        </Text>
      </View>
    </View>
  );
  const StatusCheck = () => {
    if (status == 1) {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            top: "5%",
          }}
        >
          <Text style={{ color: "green", textAlign: "center", marginRight: 5 }}>
            {"\u2B24"}
          </Text>
          <View></View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: GlobalStyle.textColor.color,
            }}
          >
            Bình thường
          </Text>
        </View>
      );
    } else if (status == 0) {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            top: "5%",
          }}
        >
          <Text style={{ color: "red", textAlign: "center", marginRight: 5 }}>
            {"\u2B24"}
          </Text>
          <View></View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: GlobalStyle.textColor.color,
            }}
          >
            Cảnh cáo
          </Text>
        </View>
      );
    }
  };
  return (
    <>
      <Header hasBackButton={true} title={"Thông tin sinh viên"}></Header>
      <ScrollView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Image
            source={{ uri: `data:image/png;base64,${b64}` }}
            style={{
              width: 100,
              height: 100,
              resizeMode: "contain",
              borderRadius: 50,
            }}
          />
          <StatusCheck></StatusCheck>
        </View>
        <View style={styles.wrapper}>
          <FlatList
            data={[
              {
                title: "Mã sinh viên",
                content: (
                  <Text style={{ textTransform: "uppercase" }}>
                    : {userID}{" "}
                  </Text>
                ),
              },
              {
                title: "Họ tên",
                content: <Text>: {userName}</Text>,
              },
              {
                title: "Giới tính",
                content: <Text>: {gender}</Text>,
              },
              {
                title: "Khóa",
                content: <Text>: {K}</Text>,
              },
              {
                title: "Nhóm",
                content: <Text>: {group}</Text>,
              },
              {
                title: "Khoa",
                content: <Text>: {major}</Text>,
              },
              {
                title: "Ngành",
                content: <Text>: {branch}</Text>,
              },
              {
                title: "Email",
                content: <Text>: {emailStudent}</Text>,
              },

              {
                title: "Số điện thoại",
                content: <Text>: {phone}</Text>,
              },
              {
                title: "Địa chỉ",
                content: <Text>: {address}</Text>,
              },
            ]}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </>
  );
};
export default InformationScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: "100%",
    height: 250,
  },
  textContainer: {
    height: "30%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    paddingTop: 5,
  },
  wrapper: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    marginLeft: "5%",
    top: "8%",
  },
  itemwrapper: {
    height: 50,
    justifyContent: "center",
  },
  item: {
    flexDirection: "row",
    marginLeft: "5%",
  },
  buttonStyle: {
    alignSelf: "center",
    backgroundColor: GlobalStyle.themeColor.color,
    alignItems: "center",
    borderRadius: 30,
    justifyContent: "center",
    padding: 15,
    paddingHorizontal: 20,
  },
  tableContainer: {
    height: "75%",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    justifyContent: "space-between",
  },
  activityIndicator: {
    alignItems: "center",
    justifyContent: "center",
  },
});
