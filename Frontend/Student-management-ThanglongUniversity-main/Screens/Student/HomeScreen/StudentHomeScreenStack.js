import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StudentHomeScreen from "../HomeScreen/StudentHomeScreen";
import EducationProgramScreen from "../HomeScreen/EducationProgram/EducationProgramScreen";
import CourseRegistrationScreen from "../HomeScreen/Registration/CourseRegistration/CourseRegistrationScreen";
import ReExaminationRegistrationScreen from "../HomeScreen/Registration/ReExaminationRegistration/ReExaminationRegistrationScreen";
import PaymentReceiptScreen from "../HomeScreen/PaymentReceipt/PaymentReceiptScreen";
import CollegeTranscriptsScreen from "../HomeScreen/ScoreReport/CollegeTranscripts/CollegeTranscriptsScreen";
import OfficialExamSchedule from "../HomeScreen/ExamSchedule/OfficialExamSchedule/OfficialExamSchedule";
import ExpectedExamSchedule from "../HomeScreen/ExamSchedule/ExpectedExamSchedule/ExpectedExamSchedule";
import OriginalBookSigningScheduleScreen from "../HomeScreen/ExamSchedule/OriginalBookSigningSchedule/OriginalBookSigningScheduleScreen";
import LearningOrientation from "../HomeScreen/LearningOrientation/LearningOrientation";
import SchooleTimeTableStack from "./TimeTable/SchoolTimeTable/SchooleTimeTableStack";
import SchoolReExaminationScheduleStack from "./ExamSchedule/SchoolReExaminationScheduleScreen/SchoolReExaminationScheduleStack";
import ScoreReportCardStack from "./ScoreReport/ScoreReportCard/ScoreReportCardStack";
import PaymentReceiptStack from "./PaymentReceipt/PaymentReceiptStack";
const Stack = createStackNavigator();

const StudentHomeScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName="Thông tin trang chủ">
      <Stack.Screen
        name="Thông tin trang chủ"
        component={StudentHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Thời khóa biểu toàn trường Stack"
        component={SchooleTimeTableStack}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Stack.Screen
        name="Lịch thi lại toàn trường"
        component={SchoolReExaminationScheduleStack}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Stack.Screen
        name="Chương trình đào tạo"
        component={EducationProgramScreen}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Stack.Screen
        name="Đăng ký học"
        component={CourseRegistrationScreen}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Stack.Screen
        name="Đăng ký thi lại"
        component={ReExaminationRegistrationScreen}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Stack.Screen
        name="Phiếu báo thu tiền Stack"
        component={PaymentReceiptStack}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Stack.Screen
        name="Bảng điểm"
        component={CollegeTranscriptsScreen}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Stack.Screen
        name="Lịch thi chính thức"
        component={OfficialExamSchedule}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Stack.Screen
        name="Lịch thi dự kiến"
        component={ExpectedExamSchedule}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Stack.Screen
        name="Phiếu báo điểm"
        component={ScoreReportCardStack}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Stack.Screen
        name="Lịch ký sổ gốc"
        component={OriginalBookSigningScheduleScreen}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
      <Stack.Screen
        name="Định hướng học tập"
        component={LearningOrientation}
        options={{ headerShown: false, unmountOnBlur: true }}
      />
    </Stack.Navigator>
  );
};

export default StudentHomeScreenStack;
