from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": 'http://3.84.113.5:4200/'}})
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Avril.8989!",
    database="prueba"
)
cursor = db.cursor()
#categoria crud
#C
@app.route('/crear_cate/<nombre_categoria>', methods=['POST'])
def create_categoria(nombre_categoria):
    cursor.execute('INSERT INTO categoria (nombre_categoria) VALUES (%s)', (nombre_categoria,))
    db.commit()
    return jsonify('Se agregó la categoria correctamente')
#L
@app.route('/categoria',methods=['GET'])
def categoria():
    cursor.execute('SELECT * FROM categoria')
    categoria = cursor.fetchall()
    return jsonify(categoria)
#R
@app.route('/categoria/<int:id_cate>',methods=['GET'])
def listar_categoria(id_cate):
    cursor.execute('SELECT * FROM categoria WHERE id_categoria = %s',(id_cate,))
    categoria = cursor.fetchall()
    return jsonify(categoria)
#U
@app.route('/actualizar_cate/<int:id_cate>/<nombre_cate>', methods=['PUT'])
def actualizar_categoria(id_cate, nombre_cate):
    cursor.execute('UPDATE categoria SET nombre_categoria = %s WHERE id_categoria = %s', (nombre_cate, id_cate))
    db.commit()
    return jsonify('Se actualizo correctamente')
#D
@app.route('/eliminar_cate/<int:id_proo>', methods=['DELETE'])
def eliminar_categoria(id_proo):
    cursor.execute('DELETE FROM categoria where id_categoria = %s', (id_proo,))
    db.commit()
    return jsonify('Se elimino correctamente')
#stock crud
#C
@app.route('/crear_stock/<cantidad_stock>/<id_producto>', methods=['POST'])
def create_stock(cantidad_stock, id_producto):
    cursor.execute('INSERT INTO stock (cantidad, id_producto) VALUES (%s,%s)', (cantidad_stock, id_producto))
    db.commit()
    return jsonify('Se agregó correctamente')
#L
@app.route('/stock',methods=['GET'])
def stock():
    cursor.execute('SELECT * FROM stock')
    categoria = cursor.fetchall()
    return jsonify(categoria)
#R
@app.route('/stock/<int:id_producto>',methods=['GET'])
def listar_stock(id_producto):
    cursor.execute('SELECT * FROM stock WHERE id_producto = %s',(id_producto,))
    categoria = cursor.fetchall()
    return jsonify(categoria)
#U
@app.route('/actualizar_stock/<int:cantidad>/<int:id_producto>', methods=['PUT'])
def actualizar_stock(cantidad, id_producto):
    cursor.execute('UPDATE stock SET cantidad = %s WHERE id_producto = %s', (cantidad, id_producto))
    db.commit()
    return jsonify('Se actualizo correctamente')
#D
@app.route('/eliminar_stock/<int:id_producto>', methods=['DELETE'])
def eliminar_stock(id_producto):
    cursor.execute('DELETE FROM stock where id_producto = %s', (id_producto,))
    db.commit()
    return jsonify('Se elimino correctamente')

#producto crud
#C
@app.route('/crear_prod/<nombre>/<precio>/<id_cate>', methods=['POST'])
def create_producto(nombre, precio, id_cate):
    cursor.execute('INSERT INTO producto (nombre, precio, id_categoria) VALUES (%s, %s, %s)', (nombre,  precio, id_cate))
    db.commit()
    return jsonify('Se agregó el producto correctamente')
#L
@app.route('/producto', methods=['GET'])
def get_productos():
    cursor.execute('SELECT * FROM producto')
    productos = cursor.fetchall()
    return jsonify(productos)

#R
@app.route('/producto/<int:id_pro>',methods=['GET'])
def listar_producto(id_pro):
    cursor.execute('SELECT * FROM producto WHERE id_producto = %s',(id_pro,))
    producto = cursor.fetchall()
    return jsonify(producto)
#U
@app.route('/actualizar_prod/<int:id_pro>/<nombre>/<precio>/<int:id_cate>', methods=['PUT'])
def actualizar_prod(id_pro, nombre, precio, id_cate):
    cursor.execute('UPDATE producto SET nombre = %s, precio = %s,  id_categoria = %s  WHERE id_producto = %s', (nombre, precio, id_cate, id_pro))
    db.commit()
    return jsonify('Se actualizó correctamente')
#D
@app.route('/eliminar_prod/<int:id_prod>', methods=['DELETE'])
def eliminar_producto(id_prod):
    cursor.execute('DELETE FROM producto where id_producto = %s', (id_prod,))
    db.commit()
    return jsonify('Se elimino correctamente')

#consulta stock
@app.route('/stock_Producto_id/<int:id_prod>', methods=['GET'])
def stock_producto_id(id_prod):
    cursor.execute('SELECT pro.id_producto, pro.nombre, pro.precio, cate.nombre_categoria, sto.cantidad FROM producto pro JOIN stock sto ON pro.id_producto = sto.id_producto JOIN categoria cate ON cate.id_categoria = pro.id_categoria WHERE pro.id_producto = %s', (id_prod,))
    consulta = cursor.fetchall()
    return jsonify(consulta)

#consulta stock por id
@app.route('/stock_Producto', methods=['GET'])
def stock_producto():
    cursor.execute('SELECT pro.id_producto, pro.nombre, pro.precio, cate.nombre_categoria, sto.cantidad FROM producto pro JOIN stock sto ON pro.id_producto = sto.id_producto JOIN categoria cate ON cate.id_categoria = pro.id_categoria')
    consulta = cursor.fetchall()
    return jsonify(consulta)


if __name__ == '__main__':
    print("Servidor Flask iniciado correctamente")
    app.run(host='0.0.0.0', port=5000)
