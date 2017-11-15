from application import db
from sqlalchemy import ForeignKey

class Listings(db.Model):
    __tablename__ = "listings"
    id = db.Column(db.String(20), primary_key = True)
    name = db.Column(db.String(200), nullable = False, index = True)
    price = db.Column(db.Float, nullable = False)
    change = db.Column(db.Float, nullable = False)
    rate_time = db.Column(db.DateTime)

class Portfolio(db.Model):
    __tablename__ = "portfolio"
    id = db.Column(db.Integer, primary_key = True)
    user = db.Column(db.Integer, ForeignKey("users.id"), nullable = False, index = True)
    company = db.Column(db.String(20), ForeignKey("listings.id"), nullable = False)
    quantity = db.Column(db.Integer, nullable = False)
    average_price = db.Column(db.Float, nullable = False)

class Transactions(db.Model):
    __tablename__ = "transactions"
    id = db.Column(db.Integer, primary_key = True)
    user = db.Column(db.Integer, ForeignKey("users.id"), nullable = False, index = True)
    company = db.Column(db.String(20), ForeignKey("listings.id"), nullable = False)
    quantity = db.Column(db.Integer, nullable = False)
    transaction_type = db.Column(db.String(5), nullable = False)
    stock_type = db.Column(db.String(10), nullable = True)
    price = db.Column(db.Float, nullable = False)
    transaction_time = db.Column(db.DateTime)
