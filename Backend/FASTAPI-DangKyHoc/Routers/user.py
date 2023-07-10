from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import decodeJWT
from model import UserSchema,StudentSchema,TeacherSchema,ImageSchema,MajorSchema,BranchSchema
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
    
    user = decodeJWT(authorization.split()[1])
    userID = user.get("user_id")

    user = db.query(UserSchema).filter_by(userName=userID).first()
    image = db.query(ImageSchema).filter_by(userName=userID).first()
    
    if(user.userRole==1):
        student = db.query(StudentSchema).get(userID) or None
        print(student)
        if student is None:
            return {"message": "Không thấy sinh viên"}

        get_student = StudentSchema(
            
            studentID=student.studentID,
            studentName=student.studentName,
            studentK=student.studentK,
            studentDOB=student.studentDOB,
            studentGender=student.studentGender,
            studentAddress=student.studentAddress,
            studentPhone=student.studentPhone,
            studentYearJoin=student.studentYearJoin,
            group=student.group,
            status=student.status
        )
        branch = db.query(BranchSchema).filter_by(branchID=student.branchID).first()
        major = db.query(MajorSchema).filter_by(majorID=branch.majorID).first()



        return {"user": user, "student": get_student,"image":image.image,"branch":branch,"major":major.majorName}
    elif(user.userRole==2):
        teacher = db.query(TeacherSchema).get(userID) or None
        if teacher is None:
            return {"message": "Không thấy giáo viên"}

        get_teacher =TeacherSchema(
            teacherID=teacher.teacherID,
            teacherName=teacher.teacherName,
            teacherDOB=teacher.teacherDOB,
            teacherGender=teacher.teacherGender,
            teacherAddress=teacher.teacherAddress,
            teacherPhone=teacher.teacherPhone,
            teacherDatejoin=teacher.teacherDatejoin,
        )
        branch = db.query(BranchSchema).filter_by(branchID=teacher.branchID).first()
        return {"user": user, "teacher": get_teacher,"image":image,"branch":branch.branchID,"major":branch.majorID}