from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists,Integer
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT,decodeJWT,refresh_access_token
from model import CourseSchema, TeacherSchema, GroupSchema, SubjectSchema,ClassSchema   
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
@router.get("/bills/{StudentID}",dependencies=[Depends(JWTBearer())])
def get_bill(StudentID: str, db: Session = Depends(get_database_session)):
    bills = (
        db.query(
            ClassSchema.courseID,
            ClassSchema.studentID,
            SubjectSchema.subjectName,
            ClassSchema.termID,
            (SubjectSchema.subjectCredit * SubjectSchema.Coefficient * 450000).cast(Integer)
        )
        .join(CourseSchema, ClassSchema.courseID == CourseSchema.courseID)
        .join(SubjectSchema, CourseSchema.subjectID == SubjectSchema.subjectID)
        .filter(ClassSchema.studentID == StudentID)
        .all()
    )

    result = []
    for bill in bills:
        result.append(
            {
                "courseID": bill[0],
                "studentID": bill[1],
                "subjectName": bill[2],
                "termID": bill[3],
                "bill": bill[4],
            }
        )

    return {"bills": result}
