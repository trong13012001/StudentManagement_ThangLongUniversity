from fastapi import Depends, FastAPI, Request, Form,status,Header,UploadFile,File
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists
import base64
from starlette.responses import RedirectResponse
from sqlalchemy.orm import Session
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT,decodeJWT
from model import UserSchema,StudentSchema,TeacherSchema
import schema
from database import SessionLocal, engine
import model
from Routers import login,student,teacher,user,image, subject, major, branch, course
import uuid

app = FastAPI()



app.include_router(login.router, tags=['Login Controller'], prefix='')
app.include_router(user.router, tags=['User Controller'], prefix='')
app.include_router(image.router, tags=['Image Controller'], prefix='')
app.include_router(course.router, tags=['Course Controller'], prefix='')

app.include_router(student.router, tags=['Student Controller'], prefix='')
app.include_router(teacher.router, tags=['Teacher Controller'], prefix='')

app.include_router(subject.router, tags=['Subject Controller'], prefix='')
app.include_router(major.router, tags=['Major Controller'], prefix='')
app.include_router(branch.router, tags=['Branch Controller'], prefix='')

# app.include_router(year.router, tags=['Year Controller'], prefix='')

