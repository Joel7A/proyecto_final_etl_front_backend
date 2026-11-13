from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import json


app = Flask(__name__)
CORS(
    app
)  # tener en cuenta que aqui se pone el dominio de confianza, si es que se tiene


def cargar_configuracion(ruta_archivo="config.json"):
    with open(ruta_archivo, "r") as archivo:
        configuracion = json.load(archivo)
    return configuracion


db_config = cargar_configuracion("config.json")


def obtener_conexion():
    return mysql.connector.connect(
        host=db_config["host"],
        user=db_config["user"],
        password=db_config["password"],
        database=db_config["database"],
    )


# endpoint para obtener la lista de los alumnos


@app.route("/api/alumnos", methods=["GET"])
def listar_alumnos():
    conexion = obtener_conexion()
    cursor = conexion.cursor(dictionary=True)
    cursor.execute("SELECT * FROM alumnos")
    alumnos = cursor.fetchall()
    cursor.close()
    conexion.close()
    return jsonify(alumnos), 200


if __name__ == "__main__":
    print("Microservicio esta corriendo en http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
