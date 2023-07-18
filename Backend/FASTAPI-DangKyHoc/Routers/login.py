from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT,decodeJWT,refresh_access_token
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



@router.post("/signup")
async def create_account(
    db: Session = Depends(get_database_session),
    userName:schema.UserSchema.userName=Form(...),
    userEmail:schema.UserSchema.userEmail=Form(...),
    userPassword:schema.UserSchema.userPassword=Form(...),
    userRole:schema.UserSchema.userRole=Form(...)
    ):
    user_exists = db.query(exists().where(UserSchema.userName == userName)).scalar()
    email_exists = db.query(exists().where(UserSchema.userEmail == userEmail)).scalar()
    if user_exists:
        return {"data": "Username bị trùng!"}
    elif email_exists:
        return {"data": "Email bị trùng!"}
    
    userSchema = UserSchema(userName = userName, userEmail =userEmail, userPassword=base64.b64encode(userPassword.encode("utf-8")),userRole=userRole)
    imageSchema=ImageSchema(userName=userName)
    db.add(imageSchema)
    if(userRole==1):
        studentSchema = StudentSchema(studentID=userName, studentEmail=userEmail)
        db.add(studentSchema)
    if(userRole==2):
        teacherSchema = TeacherSchema(teacherID=userName, teacherEmail=userEmail)
        db.add(teacherSchema)
    db.add(userSchema)
    db.commit()
    db.refresh(userSchema)
    return {
        "data": "Tài khoản đã được tạo thành công!"
    }
@router.post("/login",status_code=status.HTTP_200_OK)
async def login(db:Session=Depends(get_database_session),userName:schema.UserSchema.userName=Form(...),userPassword:schema.UserSchema.userPassword=Form(...)):
    password=base64.b64encode(userPassword.encode("utf-8"))
    user_exists = db.query(exists().where(UserSchema.userName == userName)).scalar()
    pass_exists = db.query(exists().where(UserSchema.userPassword==password)).scalar()
    user = db.query(UserSchema).filter(UserSchema.userName == userName).first()
    role_exists = user.userRole if user else None
    print(role_exists)
    if user_exists==False:
        return JSONResponse(status_code=400, content={"message": "Không có tài khoản"})
    elif pass_exists==False:
        return JSONResponse(status_code=400, content={"message": "Sai mật khẩu"})
    else:
        response_data = {"token": signJWT(userName), "userRole": role_exists}
        return response_data
@router.post("/refresh")
async def refresh_token(refresh_token: str):
    return refresh_access_token(refresh_token)



