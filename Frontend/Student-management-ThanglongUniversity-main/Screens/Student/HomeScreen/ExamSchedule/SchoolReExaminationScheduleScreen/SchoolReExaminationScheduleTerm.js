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
import Loader from "../../../../../components/Loader/Loader";
import * as SecureStore from "expo-secure-store";
import Icon1 from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import TermList from "../../../../../components/TermList";
let windowWidth = Dimensions.get("window").width;

const SchoolReExaminationScheduleTerm = () => {
  return <TermList title={"Lịch thi toàn trường"} name={"Danh sách môn thi"} />;
};

export default SchoolReExaminationScheduleTerm;
