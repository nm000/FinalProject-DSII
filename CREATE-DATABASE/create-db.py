from sqlalchemy import create_engine, Column, BigInteger, Integer, String, DateTime, MetaData, Table

# Configura la cadena de conexión
SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://sa:123456@localhost:1433/BD_PERSONAS?driver=ODBC+Driver+17+for+SQL+Server"

# Crea el motor de la base de datos
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Define el modelo de datos
metadata = MetaData()

# Tabla Persona
persona = Table(
    "Persona",
    metadata,
    Column("numDocumento", BigInteger, primary_key=True, index=True),
    Column("primerNombre", String),
    Column("segundoNombre", String),
    Column("apellidos", String),
    Column("fechaNacimiento", String),
    Column("genero", String),
    Column("correoElectronico", String),
    Column("celular", BigInteger),
    Column("foto", String)
)

# Tabla Log
log = Table(
    "Log",
    metadata,
    Column("idLog", Integer, primary_key=True, index=True),
    Column("actionLog", String),
    Column("documentoPersona", String),
    Column("tipoDocumentoPersona", String),
    Column("valorLog", String)
)

# Crea las tablas en la base de datos
metadata.create_all(bind=engine)
