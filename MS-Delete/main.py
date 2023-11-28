from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine
from sqlalchemy import BigInteger, LargeBinary, Column, Integer, String, Float, Date, Enum, Text, text

from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError

from datetime import datetime
import pytz

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
    documentoPersona = Column(Integer) 
    tipoDocumentoPersona = Column(String)
    valorLog = Column(Text)

@app.delete('/persona/{pk}')
def delete(pk: int, db: Session = Depends(get_db)):
    # Intenta cargar la persona desde la base de datos
    # Busca a la persona
    persona = db.query(Persona).filter(Persona.numDocumento == pk).first()

    if persona is None:
        raise HTTPException(status_code=404, detail="La persona no se encontró")

    # Elimina la persona de la base de datos
    db.delete(persona)
    db.commit()
    colombia_timezone = pytz.timezone('America/Bogota')

    fecha_act = datetime.now(colombia_timezone).strftime("%Y-%m-%d %H:%M:%S")

    db_log = CreateLog(
        
        dateLog= fecha_act ,  # Puedes proporcionar la fecha que desees
        accionLog="ELIMINAR",
        documentoPersona= persona.numDocumento,
        tipoDocumentoPersona= persona.tipoDocumento,  # Proporciona el valor deseado
        valorLog=f"Se eliminó a la persona con id {persona.numDocumento} el {fecha_act}"  # Proporciona el valor deseado
    )

    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    return {"message": "Persona eliminada correctamente"}

@app.get("/disp")
def mi_ruta(db: Session = Depends(get_db)):
    # Luego puedes llamar a esta función para cada tabla que deseas verificar
    if verificar_disponibilidad_tabla(db, "persona") and verificar_disponibilidad_tabla(db, "consola"):
        disp = True
    else:
        disp = False

    return {'disponibilidad': disp}