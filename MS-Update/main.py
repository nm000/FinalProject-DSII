from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine
from sqlalchemy import Column, BigInteger, VARBINARY, Integer, String, Float, Date, Enum, Text, LargeBinary, text

from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError

from pydantic import BaseModel  # Importa BaseModel de Pydantic

from datetime import datetime
import copy
import pytz
import os

app = FastAPI()

# Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_methods=['*'],
    allow_headers=['*']
)

#SQL SERVER Configuration
#os.load_dotenv()
user = os.getenv("DB_USER")
psw = os.getenv("DB_PW")
name = os.getenv("DB_NAME")
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{user}:{psw}@db:3306/{name}"

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

    def compare(self, other):
        cambios_antes = ''  # Lista para almacenar las diferencias
        cambios_despues = '' 

        # Compara atributos uno por uno
        if self.numDocumento != other.numDocumento:
            cambios_antes += f'numDocumento: {other.numDocumento}\n'
            cambios_despues += f'numDocumento: {self.numDocumento}\n'
        if self.tipoDocumento != other.tipoDocumento:
            cambios_antes += f'tipoDocumento: {other.tipoDocumento}\n'
            cambios_despues += f'tipoDocumento: {self.tipoDocumento}\n'
        if self.primerNombre != other.primerNombre:
            cambios_antes += f'primerNombre: {other.primerNombre}\n'
            cambios_despues += f'primerNombre: {self.primerNombre}\n'
        if self.segundoNombre != other.segundoNombre:
            cambios_antes += f'segundoNombre: {other.segundoNombre}\n'
            cambios_despues += f'segundoNombre: {self.segundoNombre}\n'
        if self.apellidos != other.apellidos:
            cambios_antes += f'apellidos: {other.apellidos}\n'
            cambios_despues += f'apellidos: {self.apellidos}\n'
        if self.fechaNacimiento != other.fechaNacimiento:
            cambios_antes += f'fechaNacimiento: {other.fechaNacimiento}\n'
            cambios_despues += f'fechaNacimiento: {self.fechaNacimiento}\n'
        if self.genero != other.genero:
            cambios_antes += f'genero: {other.genero}\n'
            cambios_despues += f'genero: {self.genero}\n'
        if self.correoElectronico != other.correoElectronico:
            cambios_antes += f'correoElectronico: {other.correoElectronico}\n'
            cambios_despues += f'correoElectronico: {self.correoElectronico}\n'
        if self.celular != other.celular:
            cambios_antes += f'celular: {other.celular}\n'
            cambios_despues += f'celular: {self.celular}\n'
        # Agrega comparaciones para otros atributos aquí
        if self.foto != other.foto:
            cambios_antes += 'foto: Cambiada\n'
            cambios_despues += 'foto: Cambiada\n'

        return cambios_antes, cambios_despues
    
    def to_json(self):
        return {
            'numDocumento': self.numDocumento,
            'tipoDocumento': self.tipoDocumento,
            'primerNombre': self.primerNombre,
            'segundoNombre': self.segundoNombre,
            'apellidos': self.apellidos,
            'fechaNacimiento': self.fechaNacimiento,
            'genero': self.genero,
            'correoElectronico': self.correoElectronico,
            'celular': self.celular,
            'foto': self.foto 
        }

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
    foto: str

    class Config:
        orm_mode=True
        from_attributes = True

class CreateLog(Base):
    __tablename__ = 'consola'

    idlog = Column(Integer, primary_key=True, autoincrement=True)
    dateLog = Column(String)
    accionLog = Column(String)
    documentoPersona = Column(Integer)  # Nro. Documento como bigint
    tipoDocumentoPersona = Column(String)
    valorLog = Column(Text)
    cambiosAntes = Column(Text)
    cambiosDespues = Column(Text)

@app.put('/{nro_documento}', response_model=PersonaPydantic)
def update(nro_documento: int, persona: PersonaPydantic, db: Session = Depends(get_db)):
    # Buscar la persona por su número de documento
    db_persona = db.query(Persona).filter(Persona.numDocumento == nro_documento).first()
    persona_antes = copy.copy(db_persona)

    if db_persona is None:
        raise HTTPException(status_code=404, detail="La persona no se encontró")

    # Actualizar los campos de la persona con los nuevos valores
    for key, value in persona.dict().items():
        setattr(db_persona, key, value)

    cambios_antes, cambios_despues = db_persona.compare(persona_antes)
    if(cambios_antes != '' and cambios_despues != ''):
        db.commit()
        db.refresh(db_persona)

        colombia_timezone = pytz.timezone('America/Bogota')

        fecha_act = datetime.now(colombia_timezone).strftime("%Y-%m-%d %H:%M:%S")

        db_log = CreateLog(
            
            dateLog= fecha_act ,  # Puedes proporcionar la fecha que desees
            accionLog="ACTUALIZAR",
            documentoPersona= db_persona.numDocumento,
            tipoDocumentoPersona= db_persona.tipoDocumento,  # Proporciona el valor deseado
            valorLog=f"Se modificó a la persona con id {db_persona.numDocumento} el {fecha_act}" , # Proporciona el valor deseado
            cambiosAntes= cambios_antes,
            cambiosDespues= cambios_despues
        )

        db.add(db_log)
        db.commit()
        db.refresh(db_log)

        return PersonaPydantic.from_orm(db_persona)
    else:
        raise HTTPException(status_code=405)

@app.get('/persona/{pk}')
def read(pk: int, db: Session = Depends(get_db)):
    # Intenta cargar la persona desde la base de datos
    persona = db.query(Persona).filter(Persona.numDocumento == pk).first()

    if persona is None:
        raise HTTPException(status_code=404, detail="La persona no se encontró")

    return persona.to_json()

@app.get("/disp")
def mi_ruta(db: Session = Depends(get_db)):
    # Luego puedes llamar a esta función para cada tabla que deseas verificar
    if verificar_disponibilidad_tabla(db, "persona") and verificar_disponibilidad_tabla(db, "consola"):
        disp = True
    else:
        disp = False

    return {'disponibilidad': disp}