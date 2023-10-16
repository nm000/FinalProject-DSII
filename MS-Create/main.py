from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, Float, Date, Enum, Text, LargeBinary
from sqlalchemy import BigInteger

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
    
    return PersonaPydantic.from_orm(db_persona)  # Convierte y retorna como PersonaPydantic

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
 
