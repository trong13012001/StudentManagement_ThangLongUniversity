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


#Đăng ký học
@router.post("/create_class",dependencies=[Depends(JWTBearer())], summary="Đăng ký học")
async def create_class(
    db: Session = Depends(get_database_session),
    studentID: str = Form(...),
    courseID: int = Form(...),
    termID: str = Form(...)
):
    #Check có tồn tại lớp không
    course_exists = db.query(exists().where(CourseSchema.courseID == courseID)).scalar()
    #Check có tồn tại MSV không
    student_exists = db.query(exists().where(StudentSchema.studentID == studentID)).scalar()

    if course_exists and student_exists:
        #Lấy mã môn từ course
        subjectFilter = db.query(CourseSchema).filter(CourseSchema.courseID == courseID).first()
        subjectID = subjectFilter.subjectID

        #Lấy lịch từ môn đã đăng ký
        courseFilter = (
            db.query(
                CourseSchema.courseDate,
                CourseSchema.courseShiftStart,
                CourseSchema.courseShiftEnd
            )
            .select_from(ClassSchema)
            .join(CourseSchema, ClassSchema.courseID == CourseSchema.courseID)
            .filter(ClassSchema.termID == termID).all()
        )

        #Lấy lớp đã chọn
        chosenCourseFilter = db.query(CourseSchema).filter(CourseSchema.courseID == courseID, CourseSchema.termID == termID).first()

        #Đưa ca vào mảng, khoanh vùng ca của lớp nếu trùng ngày với lớp đã chọn
        courseTime = [list(range(array[1], array[2]+1)) for array in courseFilter if array[0] == chosenCourseFilter.courseDate]
        print(courseTime)

        #Kiểm tra ca bắt đầu hoặc kết thúc của lớp đã chọn có nằm trong mảng nào không
        for i in courseTime:
            if (chosenCourseFilter.courseShiftStart in i or chosenCourseFilter.courseShiftEnd in i):
                return JSONResponse(status_code=400, content={"message": "Trùng lịch!"})
            
        classSchema = ClassSchema(courseID = courseID, studentID = studentID, termID = termID)
        gradeSchema = GradeSchema(studentID = studentID, termID = termID, subjectID = subjectID)
        db.add(classSchema)
        db.add(gradeSchema)
        db.commit()
        db.refresh(classSchema)
        db.refresh(gradeSchema)
        return {
            "data": "Đăng ký môn học thành công"
        }

    else:
        return JSONResponse(status_code=400, content={"message": "Error!"})

#Đăng ký lớp khác
@router.put("/update_class",dependencies=[Depends(JWTBearer())], summary="Đăng ký lớp khác")
async def update_course(
    db: Session = Depends(get_database_session),
    classID: int = Form(...),
    studentID: str = Form(...),
    courseID: int = Form(...)

):
    course_exists = db.query(exists().where(CourseSchema.courseID == courseID)).scalar()
    student_exists = db.query(exists().where(StudentSchema.studentID == studentID)).scalar()
    courseClass = db.query(ClassSchema).get(classID)

    if course_exists and student_exists:
        courseClass.courseID = courseID
        db.commit()
        db.refresh(courseClass)
        return {
            "data": "Thông tin chương trình học đã được cập nhật!"
        }
    else:
        return JSONResponse(status_code=400, content={"message": "Không có thông tin chương trình!"})

#Hủy đăng ký
@router.delete("/delete_class",dependencies=[Depends(JWTBearer())], summary="Hủy đăng ký")
async def delete_class(
    db: Session = Depends(get_database_session),
    classID: int = Form(...)
):
    class_exists = db.query(exists().where(ClassSchema.classID == classID)).scalar()
    if class_exists:
        class_delete = db.query(ClassSchema).get(classID)
        db.delete(class_delete)
        db.commit()
        return JSONResponse(status_code=200, content={"message": "Xóa lớp thành công!"})
    else:
        return JSONResponse(status_code=400, content={"message": "Không tồn tại lớp học!"})

#Lấy danh sách lớp
@router.get("/class_by_course/",dependencies=[Depends(JWTBearer())], summary="Lấy danh sách lớp")
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
                "className": get_class[1],
                "studentID": get_class[2],
                "studentName": get_class[3]
            }
        )
    return {"classCourse": result}

#Lấy TKB sinh viên
@router.get("/class_by_student/",dependencies=[Depends(JWTBearer())], summary="Lấy TKB sinh viên")
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
    return {"schedule": result}

#Lấy TKB sinh viên theo ngày trong tuần
@router.get("/class_by_student/{courseDate}",dependencies=[Depends(JWTBearer())], summary="Lấy TKB sinh viên theo ngày trong tuần")
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

    return {"dateSchedule": result}

#Hiện học kỳ hiện tại
@router.get("/current_term/{studentID}", dependencies=[Depends(JWTBearer())], summary="Hiện học kỳ hiện tại")
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
            "termID": term[1],
            "termName": term[2],
            "termStart": term[3],
            "termEnd": term[4]
        }
    else:
        return {"term": None}

#Hiện các môn chưa học
@router.get("/unlearned_subject/{termID}/{studentID}", dependencies=[Depends(JWTBearer())], summary="Hiện các môn chưa học")
def get_unlearned_subject(
    studentID: str,
    termID: str,
    db: Session = Depends(get_database_session)
):
    learned = (
        db.query(GradeSchema.subjectID)
        .select_from(GradeSchema)
        .filter(GradeSchema.studentID == studentID)
        .distinct()
        .all()
    )
    learned_subject_id = [subject.subjectID for subject in learned]
    print(learned_subject_id)

    unlearnedSubject = (
        db.query(BranchSubjectSchema.subjectID,SubjectSchema.subjectName)
        .select_from(BranchSubjectSchema)
        .join(SubjectSchema,BranchSubjectSchema.subjectID==SubjectSchema.subjectID)
        .join(StudentSchema, StudentSchema.branchID == BranchSubjectSchema.branchID)
        .filter(
            StudentSchema.studentID == studentID,
            ~BranchSubjectSchema.subjectID.in_(learned_subject_id)
        )
        .all()
    )

    result = []
    for unlearned in unlearnedSubject:
        result.append(
            {
                "subjectID": unlearned[0],
                "subjectName": unlearned[1]
            }
        )

    return {"unlearnedSubject": result}

#Hiện lớp theo môn
@router.get("/class_by_subject/{subjectID}/{termID}",dependencies=[Depends(JWTBearer())], summary="Hiện lớp theo môn")
def get_class_by_subject(
    subjectID = str,
    termID = str,
    db: Session = Depends(get_database_session)
    ):
    
    classes = (
        db.query(
                CourseSchema.className,
                CourseSchema.courseDate,
                CourseSchema.courseShiftStart,
                CourseSchema.courseShiftEnd,
                CourseSchema.courseRoom
            )
            .select_from(CourseSchema)
            .filter(CourseSchema.subjectID == subjectID, CourseSchema.termID == termID)
            .all()
    )

    result = []
    for courseClass in classes:
        result.append(
            {
                "className": courseClass[0],
                "courseDate": courseClass[1],
                "courseShiftStart": courseClass[2],
                "courseShiftEnd": courseClass[3],
                "courseRoom": courseClass[4]
                }
        )

    return {"courseClass": result}
