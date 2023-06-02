from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import decodeJWT
from model import UserSchema,StudentSchema
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

@router.post("/update_student_information")
async def update_student(
    db: Session = Depends(get_database_session),
    student_ID: str = Form(...),
    studentName: str = Form(...),
    studentDOB: date = Form(...),
    studentGender: str = Form(...),
    studentAddress: str = Form(...),
    studentPhone: str = Form(...),
    studentDatejoin: date = Form(...),
    studentParent: str = Form(...)
):
    student_exists = db.query(exists().where(StudentSchema.studentID == student_ID)).scalar()

    # Retrieve existing student record
    student = db.query(StudentSchema).get(student_ID)
    if student_exists:
        print(student)
    # Update student information
        student.studentName = studentName
        student.studentDOB = studentDOB
        student.studentGender = studentGender
        student.studentAddress = studentAddress
        student.studentPhone = studentPhone
        student.studentDatejoin = studentDatejoin
        student.studentParent = studentParent

        # Commit and refresh
        db.commit()
        db.refresh(student)

        return {
            "data": "Thông tin sinh viên được cập nhật thành công"
        }
    else:
        return JSONResponse(status_code=400, content={"message": "Thông tin sinh viên không có trong dữ liệu "})
