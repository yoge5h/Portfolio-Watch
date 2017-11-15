from passlib.apps import custom_app_context as pwd_context
from application import db
from application import app
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(32), index = True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(10), nullable=True)
    active = db.Column(db.Boolean, nullable=False)

    def hash_password(self,password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):        
        return pwd_context.verify(password,self.password_hash)

    def generate_auth_token(self, expiration = 6000):
        s = Serializer(app.config['SECRET_KEY'], expires_in = expiration)
        return s.dumps({'id':self.id})
  
    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None #expired valid token

        except BadSignature:
            return None

        user = User.query.filter_by(id=data['id'], active = True).first()
        return user

    