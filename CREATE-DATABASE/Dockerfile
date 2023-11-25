FROM python:3

WORKDIR /app

# Copia el contenido actual al directorio /app en el contenedor
COPY . .

# Instala las dependencias necesarias para pyodbc (si es tu elección)
RUN apt-get update && \
    apt-get install -y unixodbc-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    pip install --no-cache-dir -r requirements.txt

# O instala las dependencias necesarias para pymssql (si es tu elección)
# RUN apt-get update && \
#     apt-get install -y freetds-dev && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/* && \
#     pip install --no-cache-dir -r requirements.txt

# Define el comando predeterminado que se ejecutará al iniciar el contenedor
CMD ["python", "create-db.py"]
