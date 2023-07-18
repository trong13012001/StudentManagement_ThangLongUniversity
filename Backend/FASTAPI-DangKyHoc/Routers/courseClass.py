from fastapi import Depends, FastAPI, Request, Form,status,Header,APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy import exists
import base64
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import date
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT,decodeJWT,refresh_access_token
from model import ClassSchema, CourseSchema, StudentSchema, TermSchema, SubjectSchema, BranchSubjectSchema,GradeSchema, BranchSchema
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

#Đăng ký
@router.post("/create_class",dependencies=[Depends(JWTBearer())])
async def create_class(
    db: Session = Depends(get_database_session),
    studentID: str = Form(...),
    courseID: int = Form(...),
    termID: str = Form(...)
):
    course_add = (
        db.query(
            CourseSchema.courseDate,
            CourseSchema.courseShiftStart,
            CourseSchema.courseShiftEnd,
            CourseSchema.termID
        )
        .select_from(ClassSchema)
        .join(CourseSchema, ClassSchema.courseID == CourseSchema.courseID)
        .filter(CourseSchema.courseID == courseID)
        .all()
    )
    course_add_date = [course.courseDate for course in course_add]
    print(course_add_date)

    course_in_class = db.query(ClassSchema).filter(ClassSchema.courseID == CourseSchema.courseID, CourseSchema.termID == termID).all()
    #Check có tồn tại lớp không
    course_exists = db.query(exists().where(ClassSchema.courseID == courseID)).scalar()
    #Check có tồn tại MSV không
    student_exists = db.query(exists().where(StudentSchema.studentID == studentID)).scalar()
    #Check có tồn tại học kỳ không
    
    if course_exists and student_exists:
            return JSONResponse(status_code=400, content={"message": "Môn học đã đăng ký!"})
    # if dupl_diff and student_exists:
    #         return JSONResponse(status_code=400, content={"message": "Trùng lịch học!"})
    classSchema = ClassSchema(courseID = courseID, studentID = studentID, termID = termID)
    db.add(classSchema)
    db.commit()
    db.refresh(classSchema)
    gradeSchema = GradeSchema(studentID = studentID, termID = termID, courseID = courseID)
    db.add(gradeSchema)
    db.commit()
    db.refresh(gradeSchema)



    return {
        "data": "Đăng ký môn học thành công"
    }

#Hủy đăng ký
@router.delete("/delete_class",dependencies=[Depends(JWTBearer())])
async def delete_class(
    db: Session = Depends(get_database_session),
    classID: int = Form(...)
):
    class_exists = db.query(exists().where(ClassSchema.classID == classID)).scalar()
    if class_exists:
        class_delete = db.query(ClassSchema).get(classID)
        db.delete(class_delete)
        db.commit()
        return{
         "data": "Đã hủy đăng ký!"
        }   
    else:
        return JSONResponse(status_code=400, content={"message": "Không tồn tại lớp học!"})

#Lấy danh sách lớp
@router.get("/class_by_course/",dependencies=[Depends(JWTBearer())])
def get_class_by_course(
    courseID: int,
    termID: str,
    db: Session = Depends(get_database_session)
):
    classes = (
        db.query(
            ClassSchema.courseID,
            CourseSchema.className,
            ClassSchema.studentID,
            StudentSchema.studentName
        )
        .join(CourseSchema, ClassSchema.courseID == CourseSchema.courseID)
        .join(StudentSchema, ClassSchema.studentID == StudentSchema.studentID)
        .filter(ClassSchema.courseID == courseID, ClassSchema.termID == termID).all()
    )

    result = []
    for get_class in classes:
        result.append(
            {   
                "className": get_class[0],
                "studentID": get_class[1],
                "studentName": get_class[2]
            }
        )
    return {"classCourse": result}

#Lấy TKB sinh viên
@router.get("/class_by_student/",dependencies=[Depends(JWTBearer())])
def get_courses_with_subject_info(
    studentID: str,
    termID: str,
    db: Session = Depends(get_database_session)
    ):
    classes = (
        db.query(
            StudentSchema.studentID,
            CourseSchema.className,
            CourseSchema.courseDate,
            CourseSchema.courseShiftStart,
            CourseSchema.courseShiftEnd,
            CourseSchema.courseRoom
        )
        .join(ClassSchema, CourseSchema.courseID == ClassSchema.courseID)
        .join(StudentSchema, ClassSchema.studentID == StudentSchema.studentID)
        .filter(ClassSchema.studentID == studentID, ClassSchema.termID == termID).all()

    )

    result = []
    for get_class in classes:
        result.append(
            {
                "className": get_class[1],
                "courseDate": get_class[2],
                "courseShiftStart": get_class[3],
                "courseShiftEnd": get_class[4],
                "courseRoom": get_class[5]
            }
        )
    return {"courses": result}

#Lấy TKB sinh viên theo ngày trong tuần
@router.get("/class_by_student/{courseDate}",dependencies=[Depends(JWTBearer())])
def get_courses_with_subject_info(
    studentID: str,
    termID: str,
    courseDate = int,
    db: Session = Depends(get_database_session)
    ):
    classes = (
        db.query(
            StudentSchema.studentID,
            CourseSchema.className,
            SubjectSchema.subjectName,
            CourseSchema.courseShiftStart,
            CourseSchema.courseShiftEnd,
            CourseSchema.courseRoom,
            CourseSchema.courseID
        )
        .join(ClassSchema, CourseSchema.courseID == ClassSchema.courseID)
        .join(StudentSchema, ClassSchema.studentID == StudentSchema.studentID)
        .join(SubjectSchema, CourseSchema.subjectID == SubjectSchema.subjectID)
        .filter(ClassSchema.studentID == studentID, ClassSchema.termID == termID, CourseSchema.courseDate == courseDate).all()

    )

    result = []
    for get_class in classes:
        result.append(
            {
                "className": get_class[1],
                "subjectName": get_class[2],
                "courseShiftStart": get_class[3],
                "courseShiftEnd": get_class[4],
                "courseRoom": get_class[5],
                "courseID":get_class[6]

            }
        )

    return {"courses": result}

#Hiện học kỳ hiện tại
@router.get("/current_term/{studentID}", dependencies=[Depends(JWTBearer())])
def get_courses_with_subject_info(studentID: str, db: Session = Depends(get_database_session)):
    today = date.today()
    termDate = db.query(TermSchema.termStart, TermSchema.termEnd).filter(StudentSchema.studentID == studentID,
                                                                         TermSchema.groupID == StudentSchema.group).all()
    lastTerm = termDate[-1]
    start = lastTerm.termStart
    end = lastTerm.termEnd

    terms = (
        db.query(
            TermSchema.id,
            TermSchema.termID,
            TermSchema.termName,
            TermSchema.termStart,
            TermSchema.termEnd
        )
        .filter(StudentSchema.studentID == studentID, StudentSchema.group == TermSchema.groupID,
                TermSchema.termStart == start, TermSchema.termEnd == end, start < today < end).all()
    )

    print(termDate)
    if terms:
        term = terms[0]
        return {
            "id": term[0],
            "termid": term[1],
            "termname": term[2],
            "termstart": term[3],
            "termend": term[4]
        }
    else:
        return {"term": None}


#Hiện các môn chưa học
@router.get("/unlearned_subject/{studentID}",dependencies=[Depends(JWTBearer())])
def get_unlearned_subject(
    studentID = str,
    db: Session = Depends(get_database_session)
    ):
    
    learned = (
        db.query(
                CourseSchema.subjectID
            )
            .select_from(GradeSchema)
            .join(CourseSchema, GradeSchema.courseID == CourseSchema.courseID)
            .join(BranchSubjectSchema, CourseSchema.subjectID == BranchSubjectSchema.subjectID)
            .join(SubjectSchema, BranchSubjectSchema.subjectID == SubjectSchema.subjectID)
            .distinct()
            .all()
    )
    learned_subject_id = [subject.subjectID for subject in learned]

    unlearnedSubject = (
        db.query(
            BranchSubjectSchema.subjectID,
            SubjectSchema.subjectName
        )
        .select_from(StudentSchema)
        .join(BranchSubjectSchema, StudentSchema.branchID == BranchSubjectSchema.branchID)
        .join(SubjectSchema, BranchSubjectSchema.subjectID == SubjectSchema.subjectID)
        .filter(StudentSchema.studentID == studentID, ~SubjectSchema.subjectID.in_(learned_subject_id))
        .all()
    )

    result = []
    for unlearned in unlearnedSubject:
        result.append(
            {
                "subjectid": unlearned[0],
                "name": unlearned[1]
                }
        )

    return {"term": result}