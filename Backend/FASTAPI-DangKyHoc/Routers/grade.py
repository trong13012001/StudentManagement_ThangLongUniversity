from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists,Integer
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT,decodeJWT,refresh_access_token
from model import StudentSchema, TermSchema, ClassSchema, GradeSchema, SubjectSchema
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

#Tạo điểm môn học
@router.post("/create_grade")
async def create_grade(
    db: Session = Depends(get_database_session),
    gradeID: int = Form(...),
    studentID: str = Form(...),
    termID: str = Form(...),
    classID: int = Form(...),
    progressGrade: float = Form(...),
    bonusGrade: float = Form(...),
    examGrade1: float = Form(...),
    examGrade2: float = Form(...),
):
    #Check có tồn tại môn học không
    student_exists = db.query(exists().where(ClassSchema.studentID == studentID)).scalar()
    #Check có bị trùng tên lớp không
    class_exists = db.query(exists().where(ClassSchema.classID == classID)).sclar()
    #Check có học kỳ không
    term_exists = db.query(exists().where(ClassSchema.termID == termID)).sclar()
    finalGrade = ((progressGrade + bonusGrade)*0.3)/(examGrade1*0.7)

    #Nếu điểm QT không đủ
    if (progressGrade < 4.56):
        finalGrade = -1
    #Nếu có điểm thi 2
    elif (examGrade2 > 0):
        finalGrade = ((progressGrade + bonusGrade)*0.3)/(((examGrade1 + examGrade2)/2)*0.7)
    if student_exists and class_exists and term_exists:

        gradeSchema = GradeSchema(gradeID = gradeID, studentID = studentID, termID = termID, classID = classID,
                                  progressGrade = progressGrade, bonusGrade = bonusGrade, examGrade1 = examGrade1, examGrade2 = examGrade2, finalGrade = finalGrade)
        db.add(gradeSchema)
        db.commit()
        db.refresh(gradeSchema)
        return {
            "data:" "Tạo điểm môn học thành công!"
        }
    else:
        return JSONResponse(status_code=400, content={"message": "Không tìm thấy dữ liệu!"})

#Sửa điểm môn học
@router.put("/update_grade")
async def update_grade(
    db: Session = Depends(get_database_session),
    gradeID: int = Form(...),
    studentID: str = Form(...),
    termID: str = Form(...),
    classID: int = Form(...),
    progressGrade: float = Form(...),
    bonusGrade: float = Form(...),
    examGrade1: float = Form(...),
    examGrade2: float = Form(...),
):
    #Check có tồn tại ID không
    grade_exist = db.query(exists().where(GradeSchema.gradeID == gradeID)).scalar()
    #Check có tồn tại môn học không
    student_exists = db.query(exists().where(GradeSchema.studentID == studentID)).scalar()
    #Check có bị trùng tên lớp không
    class_exists = db.query(exists().where(GradeSchema.classID == classID)).sclar()
    #Check có học kỳ không
    term_exists = db.query(exists().where(GradeSchema.termID == termID)).sclar()
    finalGrade = ((progressGrade + bonusGrade)*0.3)/(examGrade1*0.7)

    #Nếu điểm QT không đủ
    if (progressGrade < 4.56):
        finalGrade = -1
    #Nếu có điểm thi 2
    elif (examGrade2 > 0):
        finalGrade = ((progressGrade + bonusGrade)*0.3)/(((examGrade1 + examGrade2)/2)*0.7)
    if grade_exist:
        grade = db.query(GradeSchema).get(gradeID)

        if student_exists and class_exists and term_exists:
            grade.gradeID = gradeID
            grade.studentID = studentID
            grade.termID = termID
            grade.classID = classID
            grade.progressGrade = progressGrade
            grade.bonusGrade = bonusGrade
            grade.examGrade1 = examGrade1
            grade.examGrade2 = examGrade2
            grade.finalGrade = finalGrade
            db.commit()
            db.refresh(grade)
            return {
                "data": "Thông tin điểm môn học đã được cập nhật!"
            }
        else:
            return JSONResponse(status_code=400, content={"message": "Thông tin không chính xác!"})
    else:
        return JSONResponse(status_code=400, content={"message": "Không có thông tin!"})

#Xóa điểm
@router.delete("/delete_grade/{gradeID}")
async def delete_grade(
    db: Session = Depends(get_database_session),
    gradeID = int
):
    grade_exists = db.query(exists().where(CourseSchema.gradeID == gradeID)).scalar()
    if grade_exists:
        grade = db.query(GradeSchema).get(gradeID)
        db.delete(grade)
        db.commit()
        return{
         "data": "Xóa điểm thành công!"
        }
    else:
        return JSONResponse(status_code=400, content={"message": "Không có thông tin!"})

#Phiếu báo điểm
@router.get("/grade_by_student_and_term")
def get_grade_by_student_and_term(
    db: Session = Depends(get_database_session),
    studentID: str=Header(...),
    termID: str=Header(...)
):
    #Check có tồn tại môn học không
    student_exists = db.query(exists().where(GradeSchema.studentID == studentID)).scalar()
    #Check có học kỳ không
    term_exists = db.query(exists().where(GradeSchema.termID == termID)).sclar()

    if student_exists and term_exists:
        grades = (
            db.query(
                GradeSchema.gradeID,
                GradeSchema.classID,
                GradeSchema.progressGrade,
                GradeSchema.bonusGrade,
                GradeSchema.examGrade1,
                GradeSchema.examGrade2,
                GradeSchema.finalGrade
            )
            .filter(GradeSchema.studentID == studentID, GradeSchema.termID == termID).all()
        )

        result = []
        for grade in grades:
            result.append(
                {   
                    "gradeID":grade[0],
                    "classID": grade[1],
                    "progressGrade": grade[2],
                    "bonusGrade": grade[3],
                    "examGrade1": grade[4],
                    "examGrade2": grade[5],
                    "finalGrade": grade[6]
                }
            )
        return {"courses": result}
    
#Bảng điểm
@router.get("/get_final_grade_by_student")
def get_gfinal_grade_by_student(
    db: Session = Depends(get_database_session),
    studentID: str=Header(...)
):
    #Check có tồn tại môn học không
    student_exists = db.query(exists().where(GradeSchema.studentID == studentID)).scalar()

    if student_exists:
        grades = (
            db.query(
                GradeSchema.gradeID,
                GradeSchema.classID,
                GradeSchema.finalGrade
            )
            .filter(GradeSchema.studentID == studentID).all()
        )

        result = []
        for grade in grades:
            result.append(
                {   
                    "gradeID":grade[0],
                    "classID": grade[1],
                    "finalGrade": grade[2]
                }
            )
        return {"courses": result}