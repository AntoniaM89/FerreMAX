import requests
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
    host="3.84.113.5",
    user="root",
    password="Avril.8989!",
    database="prueba"
)
cursor = db.cursor()

monedas = {
    "EAD": "Dirham",
    "ARS": "Peso Argentino",
    "AUD": "Dólar Australiano",
    "BOL": "Boliviano",
    "VND": "Dong vietnamita",
    "XPF": "Franco CFP",
    "ZAR": "Rand sudafricano",
    "DOR": "Dólar USA"
}

def obtener_tipo(codigo_moneda):
    try:
        fecha_hoy = datetime.date.today()
        if codigo_moneda == "DOR":
            url = f"https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?user=an.marambio@duocuc.cl&pass=Avril.8989!&timeseries=F073.TCO.PRE.Z.D&firstdate={str(fecha_hoy)}"
            response = requests.get(url)
            data = response.json()
            resultado = float(data["Series"]["Obs"][0]["value"])
        else:
            url = f"https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?user=an.marambio@duocuc.cl&pass=Avril.8989!&timeseries=F072.CLP.{codigo_moneda}.N.O.D&firstdate={str(fecha_hoy)}"
            response = requests.get(url)
            data = response.json()
            resultado = float(data["Series"]["Obs"][0]["value"])
        
        cursor.execute('TRUNCATE TABLE cambio')
        db.commit()
        cursor.execute('INSERT INTO cambio (id_cambio, pais, valor_moneda) VALUES (%s, %s, %s)',
                       (codigo_moneda, monedas[codigo_moneda], resultado))
        db.commit()
        
        return resultado
    except Exception as e:
        print("Error al obtener el tipo de cambio:", e)
        return None

def convertir_moneda(monto, tipo_cambio):
    return round(monto * tipo_cambio)

@app.route('/guardar_tipos_cambio', methods=['GET'])
def guardar_tipos_cambio():
    for codigo in monedas.keys():
        obtener_tipo(codigo)
    
    return jsonify({"message": "Tipos de cambio guardados exitosamente"})

if __name__ == "__main__":
    with app.app_context():
        guardar_tipos_cambio()
    app.run(host='0.0.0.0', port=5000)