from flask import Flask
from flask_cors import CORS
app = Flask(__name__)

CORS(app) #Used to disable cross origin policy to test app in local
@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)