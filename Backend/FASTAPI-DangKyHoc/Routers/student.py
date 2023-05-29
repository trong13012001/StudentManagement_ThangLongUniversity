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
    id: str = Form(...),
    name: str = Form(...),
    dob: date = Form(...),
    gender: str = Form(...),
    address: str = Form(...),
    phone: str = Form(...),
    date_of_join: date = Form(...),
    parent_name: str = Form(...)
):
    student_exists = db.query(exists().where(StudentSchema.student_id == id)).scalar()

    # Retrieve existing student record
    student = db.query(StudentSchema).get(id)
    if student_exists:

    # Update student information
        student.name = name
        student.dob = dob
        student.gender = gender
        student.address = address
        student.phone = phone
        student.date_of_join = date_of_join
        student.parent_name = parent_name

        # Commit and refresh
        db.commit()
        db.refresh(student)

        return {
            "data": "Thông tin sinh viên được cập nhật thành công"
        }
    else:
        return JSONResponse(status_code=400, content={"message": "Thông tin sinh viên không có trong dữ liệu "})
