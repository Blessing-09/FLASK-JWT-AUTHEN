"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity



api = Blueprint('api', __name__)
app = Flask(__name__)
bcrypt = Bcrypt(app)
# Allow CORS requests to this API
CORS(api)

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if data is None:
         return jsonify({"Error": "Data Not Provided"}), 400
    email = data.get("email", None)
    password = data.get("password", None)
    #check for errors in email and password
    if not email or not password:
        return jsonify({"Error": "Email and Password are required"}), 400
    if "@" not in email or "." not in email:
        return jsonify({"Error": "Invalid email format"}), 400
    # ✅ Password length check
    if len(password) < 8:
        return jsonify({"Error": "Password must be at least 8 characters long"}), 400
    #check if a user already exist 
    existing_user = User.query.filter_by(email = email).first()
    if existing_user:
        return jsonify({"Msg": "A user with this email already exist"}), 409
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    #Create new user with the data obtained
    new_user = User(email = email, password = hashed_password, is_active = True)

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "New user created!",
                    "user": new_user.serialize()}), 201


@api.route('/login', methods=['POST'])
def create_token():
    data = request.json
    if data is None:
         return jsonify({"Error": "Data Not Provided"}), 400
    email = data.get("email", None)
    password = data.get("password", None)
    #Here we can also check for errors in email and password before proceeding(BEST PRACTICE!)

     #Query your database for email and password to check if user exists in the User db table(model)
    user = User.query.filter_by(email = email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Incorrect email or password"}), 401
    
    # Create a new token with the user id inside
    access_token = create_access_token(identity=str(user.id)) #used to identify who is making the request
    return jsonify({ "token": access_token, "user_id": user.id, "email": user.email }), 200


# Protect a route with jwt_required, which will kick out requests without a valid JWT
@api.route("/profile", methods=["GET"])
@jwt_required() #This decorator protects the route and approves acccess if the request has a valid JWT token in the Authorization header (usually as a Bearer token).
def get_user():
    #  extracts the identity stored inside the JWT token.
    current_user_id = get_jwt_identity() #to get the current user based on the JWT token.

    user = User.query.get(current_user_id)
    if user is None:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify({"user": user.serialize()}), 200


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
    