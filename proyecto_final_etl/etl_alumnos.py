import pandas as pd
import mysql.connector
import json


def cargar_configuracion(ruta_archivo="config.json"):
    with open(ruta_archivo, "r") as archivo:
        configuracion = json.load(archivo)
    return configuracion


def ejecutar_etl():

    print("1. Leyendo archivo csv.")
    df = pd.read_csv("alumnos_universidad_sucio_v2.csv")

    print("2. Eliminacion de registros duplicados")
    df = df.drop_duplicates(subset=["id_alumno"], keep="first").copy()

    print("3. eliminacion de filas con valores nulos...")
    df = df.dropna(
        subset=[
            "id_alumno",
            "nombre_completo",
            "facultad",
            "carrera",
            "semestre",
            "promedio_ponderado",
            "creditos_matriculados",
        ]
    ).copy()

    print(
        "4. Estandarización de textos -quitar espacios en blanco y poner mayuculas al inicio"
    )
    df["nombre_completo"] = df["nombre_completo"].astype(str).str.strip().str.title()
    df["facultad"] = df["facultad"].astype(str).str.strip().str.title()
    df["carrera"] = df["carrera"].astype(str).str.strip().str.title()

    print("5. Convertir a numeros")

    df["semestre"] = pd.to_numeric(df["semestre"], errors="coerce")  # por  ver...
    df["promedio_ponderado"] = pd.to_numeric(df["promedio_ponderado"], errors="coerce")
    df["creditos_matriculados"] = pd.to_numeric(
        df["creditos_matriculados"], errors="coerce"
    )

    # eliminacion de los campos con valores nulos
    df = df.dropna(subset=["semestre", "promedio_ponderado", "creditos_matriculados"])
    # filtro de valores negativos o fuera de rango
    df = df[
        (df["semestre"] > 0)
        & (df["semestre"] <= 10)
        & (df["promedio_ponderado"] >= 0)
        & (df["promedio_ponderado"] <= 20)
    ].copy()

    df["semestre"] = df["semestre"].astype(int)
    df["creditos_matriculados"] = df["creditos_matriculados"].astype(int)

    print("6. Dos campos calculados")
    df["estado_academico"] = df.apply(
        lambda r: asignar_estado_academico(r["promedio_ponderado"]), axis=1
    )
    df["condicion_beca"] = df.apply(
        lambda r: asignar_condicion_beca(
            r["promedio_ponderado"], r["creditos_matriculados"]
        ),
        axis=1,
    )

    print(f"Registros procesados: {len(df)}")

    print("7. Guardando en la base de datos.")
    db_config = cargar_configuracion("config.json")

    conexion = mysql.connector.connect(
        host=db_config["host"],
        user=db_config["user"],
        password=db_config["password"],
        database=db_config["database"],
    )

    cursor = conexion.cursor()
    cursor.execute("TRUNCATE TABLE alumnos;")

    sql = "INSERT INTO alumnos(id_alumno, nombre_completo, facultad, carrera, semestre, promedio_ponderado, creditos_matriculados, estado_academico, condicion_beca) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"

    datos_insertar = [
        (
            row["id_alumno"],
            row["nombre_completo"],
            row["facultad"],
            row["carrera"],
            row["semestre"],
            row["promedio_ponderado"],
            row["creditos_matriculados"],
            row["estado_academico"],
            row["condicion_beca"],
        )
        for index, row in df.iterrows()
    ]

    cursor.executemany(sql, datos_insertar)
    conexion.commit()

    print(f"Registros insertados: {cursor.rowcount}")
    cursor.close()
    conexion.close()


def asignar_estado_academico(promedio_ponderado: float):
    if promedio_ponderado >= 16:
        return "Destacado"
    elif promedio_ponderado >= 10.5:
        return "Regular"
    else:
        return "Riesgo academico"


def asignar_condicion_beca(promedio_ponderado: float, creditos_matriculados: int):
    if promedio_ponderado >= 17.0 and creditos_matriculados >= 18:
        return "Beca Completa"
    elif promedio_ponderado >= 15.5:
        return "Media Beca"
    else:
        return "Sin Beneficio"


if __name__ == "__main__":
    ejecutar_etl()
