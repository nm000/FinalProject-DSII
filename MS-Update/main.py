from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine
from sqlalchemy import Column, BigInteger, VARBINARY, Integer, String, Float, Date, Enum, Text, LargeBinary

from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from pydantic import BaseModel  # Importa BaseModel de Pydantic

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

# Define un modelo Pydantic que coincida con la clase SQLAlchemy Persona
class PersonaPydantic(BaseModel):

    tipoDocumento: str
    primerNombre: str
    segundoNombre: str
    apellidos: str
    fechaNacimiento: str
    genero: str
    correoElectronico: str
    celular: int  # En Pydantic sigue siendo int
    foto: bytes

    class Config:
        orm_mode=True
        from_attributes = True

@app.put('/personas/{nro_documento}', response_model=PersonaPydantic)
def update(nro_documento: int, persona: PersonaPydantic, db: Session = Depends(get_db)):
    # Buscar la persona por su número de documento
    db_persona = db.query(Persona).filter(Persona.numDocumento == nro_documento).first()

    if db_persona is None:
        raise HTTPException(status_code=404, detail="La persona no se encontró")

    # Actualizar los campos de la persona con los nuevos valores
    for key, value in persona.dict().items():
        setattr(db_persona, key, value)

    db.commit()
    db.refresh(db_persona)

    return PersonaPydantic.from_orm(db_persona)
