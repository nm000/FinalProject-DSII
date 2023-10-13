from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, Float, Date, Enum, Text

from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

app = FastAPI()

# Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_methods=['*'],
    allow_headers=['*']
)

#SQL SERVER Configuration
SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://usuario:contrasena@servidor/nombre_basededatos?driver=ODBC+Driver+17+for+SQL+Server"

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
    __tablename__ = 'Personas'
    
    tipo_documento = Column(String)  # Tipo de documento
    nro_documento = Column(Integer, primary_key=True)  # Nro. Documento
    primer_nombre = Column(String)  # Primer Nombre
    segundo_nombre = Column(String)  # Segundo Nombre
    apellidos = Column(String)  # Apellidos
    fecha_nacimiento = Column(Date)  # Fecha de Nacimiento
    genero = Column(String)  # Género
    correo_electronico = Column(String)  # Correo electrónico
    celular = Column(String)  # Celular
    foto = Column(Text)  # Foto (puede ser una URL o datos binarios de la imagen)

@app.post('/personas')
def create(persona: Persona, db: Session = Depends(get_db)):
    db_persona = persona
    db.add(db_persona)
    db.commit()
    db.refresh(db_persona)
    return db_persona
