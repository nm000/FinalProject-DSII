from fastapi import FastAPI

app = FastAPI()

@app.get("/ruta")
def mi_ruta():
    return {"mensaje": "¡Hola desde FastAPI!"}
