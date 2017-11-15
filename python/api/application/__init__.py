from flask import Flask, send_file, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth
from flask_cors import CORS, cross_origin

app = Flask(__name__,static_folder='../static')
CORS(app)

app.config.from_object('config')

db = SQLAlchemy(app)
authentication = HTTPBasicAuth()
from application.auth.controllers import auth
from application.portfolio.controllers import portfolio

@app.errorhandler(401)
def custom_401(error):
    return jsonify({ 'message': "User authentication failed.", 'status':'error' }), 401

@app.route("/")
def index():
    return send_file("../templates/index.html")

@app.route("/buy")
def index1():
    return send_file("../static/index.html")

@app.route("/sell")
def index2():
    return send_file("../static/index.html")

@app.route("/change-password")
def index3():
    return send_file("../static/index.html")

@app.route("/login")
def index4():
    return send_file("../static/index.html")


app.register_blueprint(auth, url_prefix='/api/auth')
app.register_blueprint(portfolio, url_prefix='/api/portfolio')

db.create_all()