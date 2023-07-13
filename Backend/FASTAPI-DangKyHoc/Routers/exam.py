from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter,HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists,Integer
import base64
from sqlalchemy.orm import Session,joinedload
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT,decodeJWT,refresh_access_token
from model import CourseSchema, TeacherSchema, TermSchema, SubjectSchema,ClassSchema,ExamSchema
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

#Lịch thi toàn trường 
@router.get("/exam",summary="Lấy thông tin lịch thi toàn trường")
def get_exam_with_subject_info(
    db: Session = Depends(get_database_session),
    termID: str=Header(...)
):
    exams = (
        db.query(
            ExamSchema.examID,
            ExamSchema.subjectID,
            SubjectSchema.subjectName,
            ExamSchema.examShiftStart,
            ExamSchema.examShiftEnd,
            ExamSchema.examDate
 
        )
        .join(SubjectSchema, ExamSchema.subjectID == SubjectSchema.subjectID)
        .filter(ExamSchema.term==termID).all()
    )

    result = []
    for exam in exams:
        result.append(
            {   
              "examID":exam[0],
               "subjectID": exam[1],
                "subjectName": exam[2],
                "examShiftStart": exam[3],
                "examShiftEnd": exam[4],
                "examDate": exam[5],
            }
        )
    return {"exams": result}