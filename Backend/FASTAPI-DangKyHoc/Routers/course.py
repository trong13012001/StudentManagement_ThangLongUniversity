from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT,decodeJWT,refresh_access_token
from model import CourseSchema
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
        
@router.get("/course")
async def get_course(
    groupID: str=Header(...),

    db: Session = Depends(get_database_session),
):
    courses = db.query(CourseSchema).filter(CourseSchema.groupID == groupID).all()
    get_courses = []
    for course in courses:
        get_course = CourseSchema(
            subjectID=course.subjectID,
            subjectName=course.subjectName,
            className=course.className,
            courseDate=course.courseDate,
            courseShiftStart=course.courseShiftStart,
            courseShiftEnd=course.courseShiftEnd,
            courseRoom=course.courseRoom,
            courseCredits=course.courseCredits,
            teacherName=course.teacherName
        )
        get_courses.append(get_course)

    return {"courses": get_courses}
