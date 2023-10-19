from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine
from sqlalchemy import BigInteger, LargeBinary, Column, Integer, String, Float, Date, Enum, Text

from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from datetime import datetime

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

class Persona(Base):
    __tablename__ = 'Persona'

    numDocumento = Column(BigInteger, primary_key=True)  # Nro. Documento como bigint
    tipoDocumento = Column(String)
    primerNombre = Column(String)
    segundoNombre = Column(String)
    apellidos = Column(String)
    fechaNacimiento = Column(String)
    genero = Column(String)
    correoElectronico = Column(String)
    celular = Column(BigInteger)  # Celular como bigint
    foto = Column(LargeBinary)

class CreateLog(Base):
    __tablename__ = 'Consola'

    idlog = Column(Integer, primary_key=True, autoincrement=True)
    dateLog = Column(String)
    accionLog = Column(String)
    documentoPersona = Column(BigInteger)  # Nro. Documento como bigint
    tipoDocumentoPersona = Column(String)
    valorLog = Column(Text)

@app.delete('/{pk}')
def delete(pk: int, db: Session = Depends(get_db)):
    # Intenta cargar la persona desde la base de datos
    persona = db.query(Persona).filter(Persona.numDocumento == pk).first()

    if persona is None:
        raise HTTPException(status_code=404, detail="La persona no se encontró")

    # Elimina la persona de la base de datos
    db.delete(persona)
    db.commit()

    fecha_act = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db_log = CreateLog(
        
        dateLog= fecha_act ,  # Puedes proporcionar la fecha que desees
        accionLog="DELETE",
        documentoPersona= persona.numDocumento,
        tipoDocumentoPersona= persona.tipoDocumento,  # Proporciona el valor deseado
        valorLog=f"Se eliminó a la persona con id {persona.numDocumento} el {fecha_act}"  # Proporciona el valor deseado
    )

    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    return {"message": "Persona eliminada correctamente"}
