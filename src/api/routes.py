"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_bcrypt import Bcrypt


api = Blueprint('api', __name__)
bcrypt = Bcrypt()
# Allow CORS requests to this API
CORS(api)

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if data is None:
         return jsonify({"Error": "Data Not Provided"}), 400
    email = data.get("email", None)
    password = data.get("password", None)
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')



@api.route('/login', methods=['POST'])
def create_token():
    data = request.json
    if data is None:
         return jsonify({"Error": "Data Not Provided"}), 400
    email = data.get("email", None)
    password = data.get("password", None)

     # Query your database for email and password
    user = User.query.filter_by(email = email, password = password).first()
    if user is None:
        # The user was not found on the database
        return jsonify({"msg": "Bad email or password"}), 401
    
    # Create a new token with the user id inside
    access_token = create_access_token(identity=user.id)
    return jsonify({ "token": access_token, "user_id": user.id })

    
