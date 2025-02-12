from transbank.webpay.webpay_plus.transaction import Transaction
import requests
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector


app = Flask(__name__)
CORS(app)


Transaction.commerce_code = '597055555532'
Transaction.api_key_secret = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'

@app.route('/crear_transaccion', methods=['POST'])
def create_transaction():
    try:
        if not request.is_json:
            return jsonify({"error": "El cuerpo de la solicitud debe estar en formato JSON"}), 400

        data = request.get_json()
        print("Datos recibidos para la transacción:", data) 
        transaction = Transaction()
        response = transaction.create(
            buy_order=data['buy_order'],
            session_id=data['session_id'],
            amount=data['amount'],
            return_url="http://3.95.149.137:4200/return"  
        )
        print("Respuesta de creación de transacción:", response) 
        return jsonify(response)
    except Exception as e:
        print(f"Error creando la transacción: {str(e)}") 
        return jsonify({"error": str(e)}), 500

@app.route('/return', methods=['GET'])
def payment_return():
    try:
        token_ws = request.args.get('token_ws')
        if not token_ws:
            return jsonify({"error": "Falta el parámetro token_ws"}), 400
        transaction = Transaction()
        result = transaction.commit(token_ws)
        print("Resultado de la confirmación de la transacción:", result) 
        return jsonify(result)
    except Exception as e:
        print(f"Error confirmando la transacción: {str(e)}")  
        return jsonify({"error": str(e)}), 500




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
