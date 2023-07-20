from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists,Integer, func
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT,decodeJWT,refresh_access_token
from model import StudentSchema, TermSchema, ClassSchema, GradeSchema, SubjectSchema, StudentExamSchema, ExamSchema
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

#Đăng ký thi
@router.post("/create_student_exam",dependencies=[Depends(JWTBearer())], summary="Đăng ký thi")
async def create_student_exam(
    db: Session = Depends(get_database_session),
    studentID: str = Form(...),
    examID: int = Form(...)
):
    #Check có tồn tại môn học không
    student_exists = db.query(exists().where(ClassSchema.studentID == studentID)).scalar()
    exam_exists = db.query(exists().where(ExamSchema.examID == examID)).scalar()

    duplicated = db.query(exists().where(StudentExamSchema.studentID == studentID,
                                          StudentExamSchema.examID == examID)).scalar()
    if not duplicated:
        if student_exists and exam_exists:
            studentExamSchema = StudentExamSchema(studentID = studentID, examID = examID)
            db.add(studentExamSchema)
            db.commit()
            db.refresh(studentExamSchema)
            return JSONResponse(status_code=200, content={"message": "Đăng ký thi thành công!"})
        else:
            return JSONResponse(status_code=400, content={"message": "Không tìm thấy dữ liệu!"})
    else:
        return JSONResponse(status_code=400, content={"message": "Dữ liệu đã tồn tại!"})
    
#Hủy đăng ký
@router.delete("/delete_student_exam/{id}",dependencies=[Depends(JWTBearer())], summary="Hủy đăng ký thi")
async def delete_student_exam(
    db: Session = Depends(get_database_session),
    id = int
):
    student_exam_exists = db.query(exists().where(StudentExamSchema.id == id)).scalar()
    if student_exam_exists:
        student_exam = db.query(StudentExamSchema).get(id)
        db.delete(student_exam)
        db.commit()
        return JSONResponse(status_code=200, content={"message": "Hủy đăng ký thi thành công!"})
    else:
        return JSONResponse(status_code=400, content={"message": "Không có thông tin!"})

#Lịch thi
@router.get("/student_exam_by_student/{studentID}/{termID}",dependencies=[Depends(JWTBearer())], summary="Lịch thi")
def get_grade_by_student_and_term(
    db: Session = Depends(get_database_session),
    studentID = str,
    termID = str
):
    #Check có tồn tại sinh viên không
    student_exists = db.query(exists().where(StudentExamSchema.studentID == studentID)).scalar()
    #Check có học kỳ không
    term_exists = db.query(exists().where(ExamSchema.termID == termID)).scalar()

    if not (student_exists and term_exists):
        return JSONResponse(status_code=400, content={"message": "Không có thông tin!"})
    studentExams = (
        db.query(
            StudentExamSchema.studentID,
            ExamSchema.subjectID,
            SubjectSchema.subjectName,
            ExamSchema.examShiftStart,
            ExamSchema.examShiftEnd,
            ExamSchema.examDate,
            ExamSchema.termID
        )
        .select_from(StudentExamSchema)
        .join(ExamSchema, StudentExamSchema.examID == ExamSchema.examID)
        .join(SubjectSchema, ExamSchema.subjectID == SubjectSchema.subjectID)
        .filter(StudentExamSchema.studentID == studentID, ExamSchema.termID == termID).all() 
    )

    result = []
    for studentExam in studentExams:
        result.append(
            {   
                "studentID": studentExam[0],
                "subjectID": studentExam[1],
                "subjectName": studentExam[2],
                "examShiftStart": studentExam[3],
                "examShiftEnd": studentExam[4],
                "examDate": studentExam[5],
                "termID": studentExam[6],
            }
        )
    return {"studentExam": result}