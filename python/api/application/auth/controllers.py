from flask import Blueprint as BP, abort, request, jsonify, g
from models import User
from application import db
from application import authentication
from application.helpers.util import requires_admin

auth = BP('auth',__name__)

@auth.route('/')
def index():
    return 'Authentication Module'

@auth.route('/signup', methods=['POST'])
# @authentication.login_required
# @requires_admin
def register():
    username = request.json.get('username').lower()
    email = request.json.get('email').lower()
    password = request.json.get('password')
    first_name = request.json.get('firstName')
    last_name = request.json.get('lastname')
    if username is None or password is None:
        abort(400)
    if User.query.filter_by(username=username).first() is not None:
        return jsonify({ 'message': "User already created.", 'status':'warning' }), 409

    user = User(username = username)
    user.hash_password(password)
    #user.role = role
    user.email = email
    user.active = True
    user.first_name = first_name
    user.last_name = last_name
    db.session.add(user)
    db.session.commit()
    return jsonify({ 'message': "User registered successfully.", 'status':'success' }), 201



@authentication.verify_password
def verify_password(username_or_token, password):
    #Authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        # Authentication by password        
        user = User.query.filter_by(username = username_or_token, active = True).first()        
        if not user or not user.verify_password(password):
            abort(401)        
    g.user = user
    return True


@auth.route('/login')
@authentication.login_required
def get_auth_token():
    token = g.user.generate_auth_token(6000)
    return jsonify({'token':token.decode('ascii'),'duration':6000, 'username':g.user.__dict__['first_name']})


@auth.route('/users',methods = ["GET"])
@authentication.login_required
def get_all_users():
    result = []
    for u in User.query.all():
        u = u.__dict__
        user = {
            'id':u['id'],
            'username':u['username'],
            'email':u['email'],
            'role':u['role']
        }
        result.append(user)    
    return jsonify(result),200

@auth.route('/user',methods=["PUT"])
@authentication.login_required
@requires_admin
def update_user():
    id = request.json.get('id')
    try:
        user = User.query.get(id)
        if user:
            user.username = request.json.get('username')
            user.role = request.json.get('role')
            user.email = request.json.get('email')
            db.session.commit()
            return jsonify({'status' : 'success', 'message' : 'User updated successfully.'})
    except:
        return jsonify({'status' : 'error', 'message' : 'An error occured. Please contact administrator.'})

@auth.route('/user/<int:user_id>', methods=["DELETE"])
@authentication.login_required
@requires_admin
def dalete_user(user_id):
    try:
        user = User.query.filter_by(id=user_id)
        user.active = False
        db.session.commit()
        return jsonify({'status' : 'success', 'message' : 'User deleted successfully.'})
    except:
        return jsonify({'status' : 'error', 'message' : 'An error occured. Please contact administrator.'})


@auth.route('/resetpassword/<int:user_id>',methods=["PUT"])
@authentication.login_required
@requires_admin
def reset_password(user_id):
    try:
        user = User.query.get(user_id)
        if user:
            user.hash_password(user.username)
            db.session.commit()
            return jsonify({'status' : 'success', 'message' : 'Password reset successfully.'})
    except:
        return jsonify({'status' : 'error', 'message' : 'An error occured. Please contact administrator.'})

@auth.route('/changepassword',methods=["PUT"])
@authentication.login_required
def change_password():
    try:
        id = g.user.__dict__['id']        
        user = User.query.get(id)
        if user:
            newPassword = request.json.get('newPassword')
            user.hash_password(newPassword)
            db.session.commit()
            return jsonify({'status' : 'success', 'message' : 'Password changed successfully.'})
    except:
        return jsonify({'status' : 'error', 'message' : 'An error occured. Please contact administrator.'})