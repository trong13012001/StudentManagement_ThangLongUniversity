from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import decodeJWT
from model import UserSchema,StudentSchema,TeacherSchema,ImageSchema
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

@router.get("/user",dependencies=[Depends(JWTBearer())])
async def get_user(
    authorization: str = Header(...),
    db: Session = Depends(get_database_session),
):  
    print(authorization.split()[1])
    
    user = decodeJWT(authorization.split()[1])
    user_id = user.get("user_id")
    
    user = db.query(UserSchema).filter_by(username=user_id).first()
    image = db.query(ImageSchema).filter_by(user_id=user_id).first()
    
    print(user.role)
    if(user.role=="1"):
        student = db.query(StudentSchema).get(user_id) or None
        
        if student is None:
            return {"message": "Không thấy sinh viên"}

        get_student = StudentSchema(
            
            student_id=student.student_id,
            name=student.name,
            dob=student.dob,
            gender=student.gender,
            address=student.address,
            phone=student.phone,
            date_of_join=student.date_of_join,
            parent_name=student.parent_name
        )
        return {"user": user, "student": get_student,"image":image}
    elif(user.role=="2"):
        teacher = db.query(TeacherSchema).get(user_id) or None
        if teacher is None:
            return {"message": "Không thấy giáo viên"}

        get_teacher =TeacherSchema(
            teacher_id=teacher.teacher_id,
            name=teacher.name,
            dob=teacher.dob,
            gender=teacher.gender,
            address=teacher.address,
            phone=teacher.phone,
            date_of_join=teacher.date_of_join,
        )
        return {"user": user, "teacher": get_teacher,"image":image}