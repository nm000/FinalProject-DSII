from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine
from sqlalchemy import Column, BigInteger, VARBINARY, Integer, String, Float, Date, Enum, Text, LargeBinary

from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base

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
SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://DESKTOP-61S4LKS\SQLEXPRESS/AppPersonas?driver=ODBC+driver+17+for+SQL+Server"

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

class Log(Base):
    __tablename__ = 'Consola'

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

    print(tipoDoc)

    if tipoDoc:
        query = query.filter(Log.tipoDocumentoPersona == tipoDoc)
    
    if numDoc:
        query = query.filter(Log.documentoPersona == numDoc)
    
    if fecha:
        query = query.filter(Log.dateLog == fecha)

    logs = query.all()
    
    # Realiza acciones adicionales con los registros recuperados (logs)
    return logs
