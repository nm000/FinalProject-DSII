from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine
from sqlalchemy import Column, BigInteger, VARBINARY, Integer, String, Float, Date, Enum, Text, LargeBinary, text

from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.exc import OperationalError

from datetime import datetime
from typing import Optional

app = FastAPI()

# Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_methods=['*'],
    allow_headers=['*']
)

#SQL SERVER Configuration
#SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://DESKTOP-61S4LKS\SQLEXPRESS/AppPersonas?driver=ODBC+driver+17+for+SQL+Server"

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

# Instanciación de Persona
Base = declarative_base()

def verificar_disponibilidad_tabla(db: Session, tabla: str):
    try:
        # Intenta realizar una consulta simple para verificar la disponibilidad de la tabla
        db.execute(text(f"SELECT 1 FROM {tabla} LIMIT 1"))
        return True  # Si la consulta es exitosa, la tabla está disponible
    except OperationalError as e:
        print(f"Error al verificar la disponibilidad de la tabla {tabla}: {str(e)}")
        return False  # Si hay un error, la tabla no está disponible

class Log(Base):
    __tablename__ = 'consola'

    idLog = Column(Integer, primary_key=True)  # Nro. Documento como bigint
    dateLog = Column(String)
    accionLog = Column(String)
    documentoPersona = Column(BigInteger)
    tipoDocumentoPersona = Column(String)
    valorLog = Column(String)
    cambiosAntes = Column(Text)
    cambiosDespues = Column(Text)

    def to_json(self):
        return {
            'idLog': self.numDocumento,
            'dateLog': self.tipoDocumento,
            'accionLog': self.primerNombre,
            'documentoPersona': self.segundoNombre,
            'tipoDocumentoPersona': self.apellidos,
            'valorLog': self.fechaNacimiento,
            'cambiosAntes': self.genero,
            'cambiosDespues': self.correoElectronico,
            }

from fastapi import Query

@app.get("/log")
def read_logs(
    tipoDoc: str = Query(None, alias="tipoDoc"),
    numDoc: str = Query(None, alias="numDoc"),
    fecha: str = Query(None, alias="fecha"),
    db: Session = Depends(get_db)
):
    query = db.query(Log)
    
    if numDoc == 'NaN':
        numDoc = ''

    if tipoDoc:
        query = query.filter(Log.tipoDocumentoPersona == tipoDoc)
    
    if numDoc:
        query = query.filter(Log.documentoPersona == numDoc)
    
    if fecha:
        query = query.filter(Log.dateLog == fecha)

    logs = query.all()
    
    # Realiza acciones adicionales con los registros recuperados (logs)
    return logs

@app.get("/disp")
def mi_ruta(db: Session = Depends(get_db)):
    # Luego puedes llamar a esta función para cada tabla que deseas verificar
    if verificar_disponibilidad_tabla(db, "consola"):
        disp = True
    else:
        disp = False

    return {'disponibilidad': disp}