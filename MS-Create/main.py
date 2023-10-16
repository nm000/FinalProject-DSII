from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine
<<<<<<< HEAD
from sqlalchemy import Column, Integer, String, Float, Date, Enum, Text, LargeBinary
from sqlalchemy import BigInteger
=======
from sqlalchemy import Column, BigInteger, VARBINARY, Integer, String, Float, Date, Enum, Text
>>>>>>> 8865ca2099436acfd9b23a3abdb129942ddf8d7e

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

<<<<<<< HEAD
SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://DESKTOP-61S4LKS\SQLEXPRESS/AppPersonas?driver=ODBC+driver+17+for+SQL+Server"

=======
#SQL SERVER Configuration
SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://usuario:contrasena@DESKTOP-T1KMRV2\SQLEXPRESS/AppPersonas?driver=ODBC+Driver+17+for+SQL+Server"
>>>>>>> 8865ca2099436acfd9b23a3abdb129942ddf8d7e

engine = create_engine(SQLALCHEMY_DATABASE_URL)



SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Obtener instancia de la base de datos 
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base = declarative_base()
<<<<<<< HEAD
=======
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
>>>>>>> 8865ca2099436acfd9b23a3abdb129942ddf8d7e

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
    numDocumento: int  # Aquí aún puedes usar int ya que Pydantic no tiene bigint
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
        from_attributes = True

@app.post('/personas', response_model=PersonaPydantic)
def create(persona: PersonaPydantic, db: Session = Depends(get_db)):
    db_persona = Persona(**persona.dict())  # Crea una instancia de Persona
    db.add(db_persona)
    db.commit()
    db.refresh(db_persona)
<<<<<<< HEAD
    
    return PersonaPydantic.from_orm(db_persona)  # Convierte y retorna como PersonaPydantic

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
 
=======
    return db_persona

>>>>>>> 8865ca2099436acfd9b23a3abdb129942ddf8d7e
