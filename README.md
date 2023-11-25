# Para correr todo el program, necesitas:

1. SQL Server, con la base de datos cargada y las dos tablas necesarias creadas.
2. Correr los microservicios independientes.
2.1. Correr el Select, entrar a la carpeta con
```bash
    cd MS-Read
```
En la carpeta, correr el microservicio en su puerto
```bash
     uvicorn main:app --reload --port 8000
```

2.2. Correr el Delete, entrar a la carpeta con
```bash
    cd MS-Delete
```
En la carpeta, correr el microservicio en su puerto
```bash
     uvicorn main:app --reload --port 8001
```

2.3. Correr el create, entrar a la carpeta con
```bash
    cd MS-Create
```
En la carpeta, correr el microservicio en su puerto
```bash
     uvicorn main:app --reload --port 8002
```

2.4. Correr el Update, entrar a la carpeta con
```bash
    cd MS-Update
```
En la carpeta, correr el microservicio en su puerto
```bash
     uvicorn main:app --reload --port 8003
```

2.5. Correr el Log, entrar a la carpeta con
```bash
    cd MS-Log
```
En la carpeta, correr el microservicio en su puerto
```bash
     uvicorn main:app --reload --port 8004
```

2.6. Finalmente, correr el Frontend. En la carpeta main-page
```bash
    cd main-page
```
```bash
    npm start
```

Nota: las páginas del frontend se encuentran en main-page/src/components
