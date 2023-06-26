from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT,decodeJWT,refresh_access_token
from model import MajorSchema
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

@router.post("/create_major")
async def create_major(
    db: Session = Depends(get_database_session),
    majorID: str = Form(...),
    majorName: str = Form(...),
    majorELO: int = Form(...)
):
    major_exists = db.query(exists().where(MajorSchema.majorID == majorID)).scalar()
    if major_exists:
        return {"data": "Trùng mã ngành!"}
    majorSchema = MajorSchema(majorID = majorID, majorName = majorName, majorELO = majorELO)
    db.add(majorSchema)
    db.commit()
    db.refresh(majorSchema)
    return {
        "data:" "Tạo khoa thành công!"
    }

@router.post("/update_major")
async def update_major(
    db: Session = Depends(get_database_session),
    majorID: str = Form(...),
    majorName: str = Form(...),
    majorELO: int = Form(...)
):
    major_exists = db.query(exists().where(MajorSchema.majorID == majorID)).scalar()
    major = db.query(MajorSchema).get(majorID)
    if major_exists:
        print(major)
    
        major.majorName = majorName
        major.majorELO = majorELO
        db.commit()
        db.refresh(major)
        return {
            "data": "Thông tin khoa đã được cập nhật!"
        }
    else:
        return JSONResponse(status_code=400, content={"message": "Không có thông tin khoa!"})
    
@router.post("/delete_major")
async def delete_major(
    db: Session = Depends(get_database_session),
    majorID: str = Form(...)
):
    major_exists = db.query(exists().where(MajorSchema.majorID == majorID)).scalar()
    if major_exists:
        year = db.query(MajorSchema).get(majorID)
        db.delete(major)
        db.commit()
        return{
         "data": "Xóa khoa thành công!"
        }
    else:
        return JSONResponse(status_code=400, content={"message": "Không tồn tại khoa!"})