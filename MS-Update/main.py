from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine
from sqlalchemy import Column, BigInteger, VARBINARY, Integer, String, Float, Date, Enum, Text

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
SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://DESKTOP-T1KMRV2\SQLEXPRESS/AppPersonas?driver=ODBC+Driver+17+for+SQL+Server"

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
    
    nro_documento = Column(BigInteger, primary_key=True)  # Nro. Documento    
    tipo_documento = Column(String)  # Tipo de documento
    primer_nombre = Column(String)  # Primer Nombre
    segundo_nombre = Column(String)  # Segundo Nombre
    apellidos = Column(String)  # Apellidos
    fecha_nacimiento = Column(Date)  # Fecha de Nacimiento
    genero = Column(String)  # Género
    correo_electronico = Column(String)  # Correo electrónico
    celular = Column(BigInteger)  # Celular
    foto = Column(VARBINARY)  # Foto (puede ser una URL o datos binarios de la imagen)

@app.update('/')
def update(pk: BigInteger, pn : String, sn: String, aps: String, g: String, ce: String, cel: BigInteger,
            f: VARBINARY, db: Session = Depends(get_db)):
    # Intenta cargar la persona desde la base de datos
    persona = db.query(Persona).filter(Persona.nro_documento == pk).first()

    if persona is None:
        raise HTTPException(status_code=404, detail="La persona no se encontró")

    # Se actualiza toda la info
    persona.nro_documento = pk
    persona.tipo_documento = persona.tipo_documento
    persona.primer_nombre = pn
    persona.segundo_nombre = sn
    persona.apellidos = aps
    persona.fecha_nacimiento = persona.fecha_nacimiento
    persona.genero = g
    persona.correo_electronico = ce
    persona.celular = cel
    persona.foto = f

    return persona