from datetime import date
from pydantic import BaseModel

class Movie(BaseModel):
    id = int
    name = str
    desc = str
    type = str
    url = str
    rating = str
    data = date
    
    class Config:
        orm_mode = True

class UserSchema(BaseModel):
    id =int
    username=str
    email=str
    password=str
    role=int
    class Config:
        orm_mode = True

class StudentSchema(BaseModel):
    id=str
    email=str
    name=str
    dob=date
    gender=str
    address=str
    phone=str
    date_of_join=date
    parent_name=str
class TeacherSchema(BaseModel):
    id=str
    email=str
    name=str
    dob=date
    gender=str
    address=str
    phone=str
    date_of_join=date
    