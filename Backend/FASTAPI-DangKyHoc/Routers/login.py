from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT,decodeJWT,refresh_access_token
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



@router.post("/signup")
async def create_account(
    db: Session = Depends(get_database_session),
    username:schema.UserSchema.username=Form(...),
    email:schema.UserSchema.email=Form(...),
    password:schema.UserSchema.password=Form(...),
    role:schema.UserSchema.role=Form(...)
    ):
    user_exists = db.query(exists().where(UserSchema.username == username)).scalar()
    email_exists = db.query(exists().where(UserSchema.email == email)).scalar()
    if user_exists:
        return {"data": "Username bị trùng!"}
    elif email_exists:
        return {"data": "Email bị trùng!"}
    
    userSchema = UserSchema(username=username, email=email, password=base64.b64encode(password.encode("utf-8")),role=role)
        
    if(role==1):
        studentSchema = StudentSchema(student_id=username, email=email)
        db.add(studentSchema)
    if(role==2):
        teacherSchema = TeacherSchema(teacher_id=username, email=email)
        db.add(teacherSchema)
    db.add(userSchema)
    db.commit()
    db.refresh(userSchema)
    return {
        "data": "Tài khoản đã được tạo thành công!"
    }
@router.post("/login",status_code=status.HTTP_200_OK)
async def login(db:Session=Depends(get_database_session),username:schema.UserSchema.username=Form(...),password:schema.UserSchema.password=Form(...)):
    password=base64.b64encode(password.encode("utf-8"))
    user_exists = db.query(exists().where(UserSchema.username == username)).scalar()
    pass_exists = db.query(exists().where(UserSchema.password==password)).scalar()
    user = db.query(UserSchema).filter(UserSchema.username == username).first()
    role_exists = user.role if user else None
    print(role_exists)
    if user_exists and pass_exists:
        response_data = {"token": signJWT(username), "role_exists": role_exists}

        return response_data
    else:
        return JSONResponse(status_code=400, content={"message": "Sai tài khoản hoặc mật khẩu"})

@router.post("/refresh")
async def refresh_token(refresh_token: str):
    return refresh_access_token(refresh_token)
