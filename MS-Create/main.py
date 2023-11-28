from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, Float, Date, Enum, Text, LargeBinary, text
from sqlalchemy import BigInteger

from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError, IntegrityError

from pydantic import BaseModel  # Importa BaseModel de Pydantic

from datetime import datetime
import base64

app = FastAPI()

# Middleware configuration
app.add_middleware(
    CORSMiddleware, 
    allow_origins=['http://localhost:3000'],
    allow_methods=['*'],
    allow_headers=['*']
)

#SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://sa:123456@localhost:1433/BD_PERSONAS?driver=ODBC+Driver+17+for+SQL+Server"

#SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://DESKTOP-61S4LKS\SQLEXPRESS/AppPersonas?driver=ODBC+driver+17+for+SQL+Server"
#DESKTOP-61S4LKS
#DESKTOP-T1KMRV2

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://user:123456@db:3306/apppersonas"


engine = create_engine(SQLALCHEMY_DATABASE_URL)



SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Obtener instancia de la base de datos 
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verificar_disponibilidad_tabla(db: Session, tabla: str):
    try:
        # Intenta realizar una consulta simple para verificar la disponibilidad de la tabla
        db.execute(text(f"SELECT 1 FROM {tabla} LIMIT 1"))
        return True  # Si la consulta es exitosa, la tabla está disponible
    except OperationalError as e:
        print(f"Error al verificar la disponibilidad de la tabla {tabla}: {str(e)}")
        return False  # Si hay un error, la tabla no está disponible

Base = declarative_base()

class Persona(Base):
    __tablename__ = 'persona'

    numDocumento = Column(Integer, primary_key=True)  
    tipoDocumento = Column(String)
    primerNombre = Column(String)
    segundoNombre = Column(String)
    apellidos = Column(String)
    fechaNacimiento = Column(String)
    genero = Column(String)
    correoElectronico = Column(String)
    celular = Column(Integer) 
    foto = Column(String)

class CreateLog(Base):
    __tablename__ = 'consola'

    idlog = Column(Integer, primary_key=True, autoincrement=True)
    dateLog = Column(String)
    accionLog = Column(String)
    documentoPersona = Column(Integer)  # Nro. Documento como bigint
    tipoDocumentoPersona = Column(String)
    valorLog = Column(Text)

# Define un modelo Pydantic que coincida con la clase SQLAlchemy Persona
class PersonaPydantic(BaseModel):
    numDocumento: int
    tipoDocumento: str
    primerNombre: str
    segundoNombre: str
    apellidos: str
    fechaNacimiento: str
    genero: str
    correoElectronico: str
    celular: int
    foto: str

    class Config:
        from_attributes = True
        orm_mode=True

# Ruta para crear una nueva PERSONA
@app.post('/', response_model=PersonaPydantic)
def create(persona: PersonaPydantic, db: Session = Depends(get_db)):
    # Crear la persona
    db_persona = Persona(**persona.dict())  # Crea una instancia de Persona
    db.add(db_persona)
    db.commit()
    db.refresh(db_persona)
    
    fecha_act = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Crear un log del CREATE
    db_log = CreateLog(
        
        dateLog= fecha_act ,  # Puedes proporcionar la fecha que desees
        accionLog="CREAR",
        documentoPersona= db_persona.numDocumento,
        tipoDocumentoPersona= db_persona.tipoDocumento,  # Proporciona el valor deseado
        valorLog=f"Se creó a la persona con id {db_persona.numDocumento} el {fecha_act}"  # Proporciona el valor deseado
    )

    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    return PersonaPydantic.from_orm(db_persona)  # Convierte y retorna como PersonaPydantic

@app.get("/disp")
def mi_ruta(db: Session = Depends(get_db)):
    # Luego puedes llamar a esta función para cada tabla que deseas verificar
    if verificar_disponibilidad_tabla(db, "persona") and verificar_disponibilidad_tabla(db, "consola"):
        disp = True
    else:
        disp = False

    return {'disponibilidad': disp}
