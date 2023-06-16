from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists, func
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import decodeJWT
from model import UserSchema,StudentSchema, BranchSchema, YearSchema, MajorSchema
import schema
from database import SessionLocal, engine
import model
from datetime import date

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
    studentYearJoin: int = Form(...),
    studentParent: str = Form(...),
    majorID: str = Form(...),
    branchID: int = Form(...),
    status: int = Form(...)
):
    
    today = date.today()
    print(today)
    # Retrieve existing student record
    student = db.query(StudentSchema).get(student_ID)
    major = db.query(MajorSchema).get(majorID)
    branch = db.query(BranchSchema).get(branchID)
    if student and major and branch and (status == 0 or status == 1):
        branchFilter = db.query(BranchSchema).filter(BranchSchema.branchID==branchID).first()
        getGroup = branchFilter.groupEnd
        yearFilter = db.query(func.max(YearSchema.yearID)).scalar()
        studentK = studentYearJoin - 1987

        if yearFilter:
            current_year = yearFilter - studentYearJoin

        else:
            current_year = 0

        if status == 1:
            if current_year == 0:
                group = 3
            elif current_year == 1:
                group = 2
            elif current_year > 1:
                group = getGroup
            else:
                group = 3
        else:
            group = 0
        
    # Update student information
        student.studentName = studentName
        student.studentDOB = studentDOB
        student.studentK = studentK
        student.studentGender = studentGender
        student.studentAddress = studentAddress
        student.studentPhone = studentPhone
        student.studentDatejoin = studentDatejoin
        student.studentYearJoin = studentYearJoin
        student.studentParent = studentParent
        student.majorID = majorID
        student.branchID = branchID
        student.group = group
        student.status = status

        # Commit and refresh
        db.commit()
        db.refresh(student)

        return {
            "data": "Thông tin sinh viên được cập nhật thành công!"
        }
    else:
        return JSONResponse(status_code=400, content={"message": "Kiểm tra lại mã sinh viên, mã khoa, mã ngành hoặc trạng thái (0 = Thôi học, 1 = Bình thường)"})



@router.post("/update_student_major_information")
async def update_student(
    db: Session = Depends(get_database_session),
    student_ID: str = Form(...),
    branchID:int= Form(...),

):
    student_exists = db.query(exists().where(StudentSchema.studentID == student_ID)).scalar()

    # Retrieve existing student record
    student = db.query(StudentSchema).get(student_ID)
    if student_exists:
        studentFilter = db.query(StudentSchema).filter(StudentSchema.studentID==student_ID).first()
        branchFilter = db.query(BranchSchema).filter(BranchSchema.branchID==branchID).first()

        getGroup = branchFilter.groupEnd

        yearFilter = db.query(YearSchema).filter(YearSchema.yearID==date.today().year-1).first()
        if(date.today()>yearFilter.yearEnd):
            yearFilter = db.query(YearSchema).filter(YearSchema.yearID==date.today().year).first()

        today = date.today()
        if yearFilter:
            current_year = yearFilter.yearID - studentFilter.studentYearJoin

        else:
            current_year = 0

        if studentFilter.status == 1:
            if current_year == 0:
                group = 3
            elif current_year == 1:
                group = 2
            elif current_year > 1:
                group = getGroup
            else:
                group = 3
        else:
            group = 0
        
    # Update student information
        student.branchID = branchID
        student.group = group
        # Commit and refresh
        db.commit()
        db.refresh(student)

        return {
            "data": "Thông tin ngành sinh viên được cập nhật thành công"
        }
    else:
        return JSONResponse(status_code=400, content={"message": "Thông tin sinh viên không có trong dữ liệu "})
