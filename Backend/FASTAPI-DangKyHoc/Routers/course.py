from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists,Integer
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT,decodeJWT,refresh_access_token
from model import CourseSchema, TeacherSchema, TermSchema, SubjectSchema,ClassSchema   
from model import CourseSchema
import schema
from database import SessionLocal, engine
import model

router = APIRouter()  
model.Base.metadata.create_all(bind=engine)


def get_database_session():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

@router.post("/create_course")
async def create_course(
    db: Session = Depends(get_database_session),
    courseID: int = Form(...),
    subjectID: str = Form(...),
    className: str = Form(...),
    courseDate: int = Form(...),
    courseShiftStart: int = Form(...),
    courseShiftEnd: int = Form(...),
    courseRoom: str = Form(...),
    teacherID: str = Form(...),
    termID: str = Form(...)
):
    #Check có tồn tại môn học không
    subject_non_exists = db.query(exists().where(SubjectSchema.subjectID != subjectID)).scalar()
    #Check có bị trùng tên lớp không
    class_exists = db.query(exists().where(CourseSchema.className == className)).sclar()
    #Check có bị trùng lịch học không
    course_time = db.query(exists().where(CourseSchema.courseDate == courseDate
    and CourseSchema.courseShiftStart == courseShiftStart and CourseSchema.courseShiftEnd == courseShiftEnd 
    and CourseSchema.courseRoom == courseRoom)).scalar()
    
    if subject_non_exists:
        return {"data": "Không tìm thấy môn học!"}
    elif class_exists:
        return {"data": "Trùng tên lớp!"}
    elif course_time:
        return {"data": "Trùng thời gian học!"}

    courseSchema = CourseSchema(courseID = courseID, subjectID = subjectID, className = className,
    courseDate = courseDate, courseShiftStart = courseShiftStart, courseShiftEnd = courseShiftEnd,
    courseRoom = courseRoom, teacherID = teacherID, termID = termID)
    db.add(courseSchema)
    db.commit()
    db.refresh(courseSchema)
    return {
        "data:" "Tạo chương trình học thành công!"
    }

@router.post("/update_course")
async def update_course(
    db: Session = Depends(get_database_session),
    courseID: int = Form(...),
    subjectID: str = Form(...),
    className: str = Form(...),
    courseDate: int = Form(...),
    courseShiftStart: int = Form(...),
    courseShiftEnd: int = Form(...),
    courseRoom: str = Form(...),
    teacherID: str = Form(...),
    termID: str = Form(...)
):
    subject_non_exists = db.query(exists().where(SubjectSchema.subjectID != subjectID)).scalar()
    course_exists = db.query(exists().where(CourseSchema.courseID == courseID)).scalar()
    course = db.query(CourseSchema).get(courseID)

    if course_exists:
        print(course)
        course_time = db.query(exists().where(CourseSchema.courseDate == courseDate
        and CourseSchema.courseShiftStart == courseShiftStart and CourseSchema.courseShiftEnd == courseShiftEnd 
        and CourseSchema.courseRoom == courseRoom)).scalar()

        if subject_non_exists:
            return {"data": "Không tìm thấy môn học!"}
        elif course_time:
            return {"data": "Trùng thời gian học!"}

        course.subjectID = subjectID
        course.className = className
        course.courseDate = courseDate
        course.courseShiftStart = courseShiftStart
        course.courseShiftEnd = courseShiftEnd
        course.courseRoom = courseRoom
        course.teacherID = teacherID
        course.termID = termID
        db.commit()
        db.refresh(course)
        return {
            "data": "Thông tin chương trình học đã được cập nhật!"
        }
    else:
        return JSONResponse(status_code=400, content={"message": "Không có thông tin chương trình!"})

@router.post("/delete_course")
async def delete_course(
    db: Session = Depends(get_database_session),
    courseID: int = Form(...)
):
    course_exists = db.query(exists().where(CourseSchema.courseID == courseID)).scalar()
    if course_exists:
        course = db.query(CourseSchema).get(courseID)
        db.delete(course)
        db.commit()
        return{
         "data": "Xóa lớp học thành công!"
        }
    else:
        return JSONResponse(status_code=400, content={"message": "Không tồn tại lớp học!"})

#Danh sách lớp theo học kỳ  
@router.get("/course")
def get_courses_with_subject_info(
    db: Session = Depends(get_database_session),
    termID: str=Header(...)
):
    courses = (
        db.query(
            CourseSchema.courseID,
            CourseSchema.subjectID,
            SubjectSchema.subjectName,
            CourseSchema.className,
            CourseSchema.courseDate,
            CourseSchema.courseShiftStart,
            CourseSchema.courseShiftEnd,
            CourseSchema.courseRoom,
            CourseSchema.teacherID,
            TeacherSchema.teacherName,
            CourseSchema.termID 
        )
        .join(SubjectSchema, CourseSchema.subjectID == SubjectSchema.subjectID)
        .join(TeacherSchema, CourseSchema.teacherID==TeacherSchema.teacherID)
        .filter(CourseSchema.termID==termID).all()
    )

    result = []
    for course in courses:
        result.append(
            {   
                "courseID":course[0],
                "subjectID": course[1],
                "subjectName": course[2],
                "className": course[3],
                "courseDate": course[4],
                "courseShiftStart": course[5],
                "courseShiftEnd": course[6],
                "courseRoom": course[7],
                "teacherID": course[8],
                "teacherName":course[9],
                "termID": course[10],
            }
        )
    return {"courses": result}

#Lớp theo ID
@router.get("/course/{courseID}")
def get_courses_with_subject_info(courseID: int,
    db: Session = Depends(get_database_session)):
    courses = (
        db.query(
            CourseSchema.courseID,
            CourseSchema.subjectID,
            SubjectSchema.subjectName,
            CourseSchema.className,
            CourseSchema.courseDate,
            CourseSchema.courseShiftStart,
            CourseSchema.courseShiftEnd,
            CourseSchema.courseRoom,
            CourseSchema.teacherID,
            TeacherSchema.teacherName,
            CourseSchema.termID
        )
        .join(SubjectSchema, CourseSchema.subjectID == SubjectSchema.subjectID)
        .join(TeacherSchema, CourseSchema.teacherID==TeacherSchema.teacherID)
        .filter(CourseSchema.courseID==courseID).all()
    )

    result = []
    for course in courses:
        result.append(
            {
                "courseID":course[0],
                "subjectID": course[1],
                "subjectName": course[2],
                "className": course[3],
                "courseDate": course[4],
                "courseShiftStart": course[5],
                "courseShiftEnd": course[6],
                "courseRoom": course[7],
                "teacherID": course[8],
                "teacherName":course[9],
                "termID": course[10],
            }
        )
    print(course[0])

    return {"courses": result}

