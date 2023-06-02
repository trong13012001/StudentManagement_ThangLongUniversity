from typing import Text
from sqlalchemy import Column,Date,BLOB
from sqlalchemy.types import String, Integer, Text
from database import Base

class UserSchema(Base):
    __tablename__="user"
    userID = Column(Integer, primary_key=True, index=True)
    userName=Column(String(45),unique=True)
    userEmail=Column(String(45),unique=True)
    userPassword=Column(String(45))
    userRole=Column(Integer)

class StudentSchema(Base):
    __tablename__="student"
    studentID = Column(String(6),primary_key=True, index=True)
    studentEmail=Column(String(45),unique=True)
    studentName=Column(String(45))
    studentDOB=Column(Date)
    studentGender=Column(String(4))
    studentAddress=Column(String(45))
    studentPhone=Column(String(10))
    studentDatejoin=Column(Date)
    studentParent=Column(String(45))
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
class ImageSchema(Base):
    __tablename__="image"
    userID=Column(String(6),primary_key=True, index=True)
    image=Column(String)
