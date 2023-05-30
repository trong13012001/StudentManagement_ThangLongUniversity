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
from model import Movie,UserSchema,StudentSchema,TeacherSchema
import schema
from database import SessionLocal, engine
import model
from Routers import login,student,teacher,user,image
import uuid

app = FastAPI()



app.include_router(login.router, tags=['Login Controller'], prefix='')
app.include_router(student.router, tags=['Student Controller'], prefix='')
app.include_router(teacher.router, tags=['Teacher Controller'], prefix='')
app.include_router(user.router, tags=['User Controller'], prefix='')
app.include_router(image.router, tags=['Image Controller'], prefix='')

# @app.get("/", response_class=HTMLResponse)
# async def read_item(request: Request, db: Session = Depends(get_database_session)):
#     records = db.query(Movie).all()




# @app.get("/movie/{name}", response_class=HTMLResponse)
# def read_item(request: Request, name: schema.Movie.name, db: Session = Depends(get_database_session)):
#     item = db.query(Movie).filter(Movie.id == name).first()
    
    



   
# @app.patch("/movie/{id}")
# async def update_movie(request: Request, id: int, db: Session = Depends(get_database_session)):
#     requestBody = await request.json()
#     movie = db.query(Movie).get(id)
#     movie.name = requestBody['name']
#     movie.desc = requestBody['desc']
#     db.commit()
#     db.refresh(movie)
#     newMovie = jsonable_encoder(movie)
#     return JSONResponse(status_code=200, content={
#         "status_code": 200,
#         "message": "success",
#         "movie": newMovie
#     })


# @app.delete("/movie/{id}")
# async def delete_movie(request: Request, id: int, db: Session = Depends(get_database_session)):
#     movie = db.query(Movie).get(id)
#     db.delete(movie)
#     db.commit()
#     return JSONResponse(status_code=200, content={
#         "status_code": 200,
#         "message": "success",
#         "movie": None
#     })
