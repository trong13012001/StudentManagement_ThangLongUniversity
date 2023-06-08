from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT,decodeJWT,refresh_access_token
from model import BranchSchema, MajorSchema
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

@router.post("/create_branch")
async def create_branch(
    db: Session = Depends(get_database_session),
    branchID: str = Form(...),
    branchName: str = Form(...),
    majorID: str = Form(...)
):
    branch_exists = db.query(exists().where(BranchSchema.branchID == branchID)).scalar()
    major_non_exists = db.query(exists().where(MajorSchema.majorID != majorID)).scalar()

    if branch_exists:
        return {"data": "Trùng mã ngành!"}
    elif major_non_exists:
        return {"data": "Không tìm thấy khoa!"}

    branchSchema = BranchSchema(branchID = branchID, branchName = branchName, majorID = majorID)
    db.add(branchSchema)
    db.commit()
    db.refresh(branchSchema)
    return {
        "data:" "Tạo chuyên ngành thành công!"
    }

@router.post("/update_branch")
async def update_branch(
    db: Session = Depends(get_database_session),
    branchID: str = Form(...),
    branchName: str = Form(...),
    majorID: str = Form(...)
):
    branch_exists = db.query(exists().where(BranchSchema.branchID == branchID)).scalar()
    major_non_exists = db.query(exists().where(MajorSchema.majorID != majorID)).scalar()
    branch = db.query(BranchSchema).get(branchID)
    if branch_exists:
        print(branch)
        if major_non_exists:
            return {"data": "Không tìm thấy khoa!"}
        branch.branchName = branchName
        branch.majorID = majorID
        db.commit()
        db.refresh(branch)
        return {
            "data": "Thông tin chuyên ngành đã được cập nhật!"
        }
    else:
        return JSONResponse(status_code=400, content={"message": "Không có thông tin chuyên ngành!"})