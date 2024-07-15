import requests
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Avril.8989!",
    database="prueba"
)
cursor = db.cursor()


def guardar_tipos_cambio():
    try:
        fecha_hoy = datetime.date.today()
        url = f"https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?user=an.marambio@duocuc.cl&pass=Avril.8989!&timeseries=F073.TCO.PRE.Z.D&firstdate={str(fecha_hoy)}"
        response = requests.get(url)
        data = response.json()
        resultado = float(data["Series"]["Obs"][0]["value"])
        print(resultado)
        cursor.execute('TRUNCATE TABLE cambio')
        db.commit()
        cursor.execute('INSERT INTO cambio (valor_moneda) VALUES (%s)',( resultado,))
        db.commit()
        
        return resultado
    except Exception as e:
        print("Error al obtener el tipo de cambio:", e)
        return None


@app.route('/conversion', methods=['GET'])
def conversion():
    print('hola')
    cursor.execute('SELECT valor_moneda FROM cambio')
    valor_moneda = cursor.fetchall()
    return (valor_moneda)

if __name__ == "__main__":
    guardar_tipos_cambio()
    app.run(host='0.0.0.0', port=5001)