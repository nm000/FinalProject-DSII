from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/data', methods=['GET'])
def get_data():
    # Aquí obtienes y procesas los datos que deseas enviar a React
    data = {"message": "Hola desde Flask"}
    return jsonify(data)

if __name__ == '__main__':
    app.run()