from typing import Text
from sqlalchemy import Column,Date,BLOB
from sqlalchemy.types import String, Integer, Text, Float
from database import Base

#Tài khoản
class UserSchema(Base):
    __tablename__="user"
    userID = Column(Integer, primary_key=True, index=True)
    userName=Column(String(45),unique=True)
    userEmail=Column(String(45),unique=True)
    userPassword=Column(String(45))
    userRole=Column(Integer)
#Sinh viên
class StudentSchema(Base):
    __tablename__="student"
    studentID = Column(String(6),primary_key=True, index=True)
    studentEmail=Column(String(45),unique=True)
    studentName=Column(String(45))
    studentK=Column(Integer)
    studentDOB=Column(Date)
    studentGender=Column(String(4))
    studentAddress=Column(String(45))
    studentPhone=Column(String(10))
    studentDatejoin=Column(Date)
    studentParent=Column(String(45))
    majorID=Column(String(6))
    branchID=Column(Integer)
    groupID=Column(String(10))

#Giáo viên
class TeacherSchema(Base):
    __tablename__="teacher"
    teacherID = Column(String(6),primary_key=True, index=True)
    teacherEmail=Column(String(45),unique=True)
    teacherName=Column(String(45))
    teacherDOB=Column(Date)
    teacherGender=Column(String(4))
    teacherAddress=Column(String(45))
    teacherPhone=Column(String(10))
    teacherDatejoin=Column(Date)
    majorID=Column(String(6))
    branchID=Column(Integer)

#Avatar
class ImageSchema(Base):
    __tablename__="image"
    userID=Column(String(6),primary_key=True, index=True)
    image=Column(String)

#Khoa
class MajorSchema(Base):
    __tablename__="major"
    majorID=Column(String(6),primary_key=True, index=True)
    majorName=Column(String)

#Ngành
class BranchSchema(Base):
    __tablename__="branch"
    branchID=Column(Integer(),primary_key=True, index=True)
    branchName=Column(String)
    majorID=Column(String)

#Môn học
class SubjectSchema(Base):
    __tablename__="subject"
    subjectID=Column(String(5), primary_key=True, index=True)
    subjectName=Column(String(60))
    majorID=Column(String(6))
    subjectCredit=Column(Integer)

#Chương trình
class CourseSchema(Base):
    __tablename__="course"
    courseID=Column(Integer, primary_key=True)
    subjectID=Column(String(5))
    className=Column(String(30), unique=True)
    courseDate=Column(Integer)
    courseShiftStart=Column(Integer)
    courseShiftEnd=Column(Integer)
    courseRoom=Column(String(15))
    teacherID=Column(String(6))
    groupID=Column(String(10))

#Lớp học
class ClassSchema(Base):
    __tablename__="class"
    courseID=Column(String(5), primary_key=True)
    studentID=Column(String(6), primary_key=True)

#Phiếu báo điểm
class GradeSchema(Base):
    __tablename__="grade"
    studentID=Column(String(6), primary_key=True)
    groupID=Column(String(10))
    courseID=Column(String(5))
    progressGrade=Column(Float)
    bonusGrade=Column(Float)
    examGrade1=Column(Float)
    examGrade2=Column(Float)
    finalGrade=Column(Float)

#Nhóm
class GroupSchema(Base):
    __tablename__="group"
    groupID=Column(String(10), primary_key=True)
    groupName=Column(String(45))
    groupYear=Column(String(15))
    groupTerm=Column(Integer)
