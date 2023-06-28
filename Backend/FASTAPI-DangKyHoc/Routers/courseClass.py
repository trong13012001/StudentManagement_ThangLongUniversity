from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT,decodeJWT,refresh_access_token
from model import StudentSchema, ClassSchema, CourseSchema, StudentSchema, TermSchema
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

#Đăng ký
@router.post("/create_class")
async def create_class(
    db: Session = Depends(get_database_session),
    classID: int = Form(...),
    studentID: str = Form(...),
    courseID: int = Form(...),
    termID: str = Form(...)
):
    #Check có tồn tại lớp không
    course_exists = db.query(exists().where(CourseSchema.courseID == courseID)).sclar()
    #Check có tồn tại MSV không
    student_exists = db.query(exists().where(StudentSchema.studentID == studentID)).scalar()
    
    if course_exists and student_exists:
        return {"data": "Đã đăng ký!"}
    
    classSchema = ClassSchema(classID = classID, courseID = courseID, studentID = studentID, termID = termID)
    db.add(classSchema)
    db.commit()
    db.refresh(classSchema)
    return {
        "data:" "Đăng ký học thành công!"
    }

#Hủy đăng ký
@router.post("/delete_class")
async def delete_class(
    db: Session = Depends(get_database_session),
    classID: int = Form(...)
):
    class_exists = db.query(exists().where(ClassSchema.classID == classID)).scalar()
    if class_exists:
        class_delete = db.query(ClassSchema).get(classID)
        db.delete(class_delete)
        db.commit()
        return{
         "data": "Đã hủy đăng ký!"
        }
    else:
        return JSONResponse(status_code=400, content={"message": "Không tồn tại lớp học!"})

#Lấy danh sách lớp
@router.get("/class_by_course/{courseID}")
def get_class_by_course(
    db: Session = Depends(get_database_session),
    courseID: str=Header(...),
    termID: str=Header(...)
):
    classes = (
        db.query(
            CourseSchema.className,
            ClassSchema.studentID,
            StudentSchema.studentName
        )
        .join(CourseSchema, ClassSchema.courseID == CourseSchema.courseID)
        .join(StudentSchema, ClassSchema.studentID == StudentSchema.studentID)
        .filter(ClassSchema.courseID == courseID, ClassSchema.termID == termID).all()
    )

    result = []
    for get_class in classes:
        result.append(
            {   
                "className": get_class[0],
                "studentID": get_class[1],
                "studentName": get_class[2]
            }
        )
    return {"courses": result}

#Lấy TKB sinh viên
@router.get("/class_by_student/{studentID}")
def get_courses_with_subject_info(
    studentID: str=Header(...),
    termID: str=Header(...),
    db: Session = Depends(get_database_session)
    ):
    classes = (
        db.query(
            CourseSchema.className,
            CourseSchema.courseDate,
            CourseSchema.courseShiftStart,
            CourseSchema.courseShiftEnd,
            CourseSchema.courseRoom
        )
        .join(ClassSchema, ClassSchema.courseID == CourseSchema.courseID)
        .join(TermSchema, ClassSchema.termID == TermSchema.termID)
        .filter(ClassSchema.studentID == studentID, ClassSchema.termID == termID)
        .all()

    )

    result = []
    for get_class in classes:
        result.append(
            {
                "className": get_class[0],
                "courseDate": get_class[1],
                "courseShiftStart": get_class[2],
                "courseShiftEnd": get_class[3],
                "courseRoom": get_class[4]
            }
        )

    return {"courses": result}