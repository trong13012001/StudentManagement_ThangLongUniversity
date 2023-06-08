from datetime import date
from pydantic import BaseModel
class UserSchema(BaseModel):
    userID =int
    userName=str
    userEmail=str
    userPassword=str
    userRole=int
    class Config:
        orm_mode = True

class StudentSchema(BaseModel):
    studentID=str
    studentEmail=str
    studentName=str
    studentDOB=date
    studentGender=str
    studentAddress=str
    studentPhone=str
    studentDatejoin=date
    studentParent=str

class TeacherSchema(BaseModel):
    teacherID=str
    teacherEmail=str
    teacherName=str
    teacherDOB=date
    teacherGender=str
    teacherAddress=str
    teacherPhone=str
    teacherDatejoin=date

class ImageSchema(BaseModel):
    userID=str
    image=str

class MajorSchema(BaseModel):
    majorID=str
    majorName=str

class BranchSchema(BaseModel):
    branchID=str
    branchName=str
    majorID=str

class ImageSchema(BaseModel):
    branchID=int
    branchName=str

class SubjectSchema(BaseModel):
    subjectID=str
    subjectName=str
    majorID=str
    subjectCredit=int

class CourseSchema(BaseModel):
    courseID=int
    subjectID=str
    className=str
    courseDate=int
    courseShiftStart=int
    courseShiftEnd=int
    courseRoom=str
    teacherID=str
    groupID=str

class ClassSchema(BaseModel):
    courseID=str
    studentID=str

class GradeSchema(BaseModel):
    studentID=str
    groupID=str
    courseID=str
    progressGrade=float
    bonusGrade=float
    examGrade1=float
    examGrade2=float
    finalGrade=float

class GroupSchema(BaseModel):
    groupID=str
    groupName=str
    groupYear=str
    groupTerm=str