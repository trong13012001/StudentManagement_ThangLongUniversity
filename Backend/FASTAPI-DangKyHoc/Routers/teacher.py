from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT,decodeJWT
from model import UserSchema,StudentSchema,TeacherSchema
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


@router.post("/update_teacher_information")
async def update_teacher(
    db: Session = Depends(get_database_session),
    id: str = Form(...),
    name: str = Form(...),
    dob: date = Form(...),
    gender: str = Form(...),
    address: str = Form(...),
    phone: str = Form(...),
    date_of_join: date = Form(...),
):
    teacher_exists = db.query(exists().where(TeacherSchema.teacher_id == id)).scalar()

    teacher = db.query(TeacherSchema).get(id)
    if teacher_exists:
   
        teacher.name = name
        teacher.dob = dob
        teacher.gender = gender
        teacher.address = address
        teacher.phone = phone
        teacher.date_of_join = date_of_join

        # Commit and refresh
        db.commit()
        db.refresh(teacher)

        return {
            "data": "Thông tin giáo viên được cập nhật thành công"
        }
    else:
        return JSONResponse(status_code=400, content={"message": "Thông tin giáo viên không có trong dữ liệu "})
