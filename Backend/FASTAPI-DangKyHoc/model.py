from typing import Text
from sqlalchemy import Column,Date,BLOB
from sqlalchemy.types import String, Integer, Text
from database import Base

class Movie(Base):
    __tablename__ = "Movie"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True)
    desc = Column(Text())
    type = Column(String(20))
    url = Column(String(100))
    rating = Column(Integer)

class UserSchema(Base):
    __tablename__="user"
    id = Column(Integer, primary_key=True, index=True)
    username=Column(String(45),unique=True)
    email=Column(String(45),unique=True)
    password=Column(String(45))
    role=Column(Integer)

class StudentSchema(Base):
    __tablename__="student"
    student_id = Column(String(6),primary_key=True, index=True)
    email=Column(String(45),unique=True)
    name=Column(String(45))
    dob=Column(Date)
    gender=Column(String(4))
    address=Column(String(45))
    phone=Column(String(10))
    date_of_join=Column(Date)
    parent_name=Column(String(45))
class TeacherSchema(Base):
    __tablename__="teacher"
    teacher_id = Column(String(6),primary_key=True, index=True)
    email=Column(String(45),unique=True)
    name=Column(String(45))
    dob=Column(Date)
    gender=Column(String(4))
    address=Column(String(45))
    phone=Column(String(10))
    date_of_join=Column(Date)
class ImageSchema(Base):
    __tablename__="image"
    user_id=Column(String(6),primary_key=True, index=True)
    image=Column(String)
