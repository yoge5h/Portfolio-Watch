from flask import Blueprint as BP, abort, request, jsonify, g
from models import Portfolio, Transactions, Listings
from application import db
from application import authentication
from application.helpers.util import requires_admin
from application.helpers.stock_data import get_stock_data
import datetime
import pytz

portfolio = BP('portfolio',__name__)


@portfolio.route('/refresh-data')
@authentication.login_required
def refresh_data():
    new_data = get_stock_data()
    for d in new_data:
        listing = Listings.query.get(d['id'])
        if listing:
            listing.price = d['price']
            listing.change = d['change']
            listing.rate_time = datetime.datetime.utcnow()
            db.session.commit()
        else:            
            listing = Listings(id = d['id'])
            listing.name = d['name']
            listing.price = d['price']
            listing.change = d['change']
            listing.rate_time = datetime.datetime.utcnow()
            db.session.add(listing)
            db.session.commit()    

    return get_portfoio()          

@portfolio.route('/buy', methods=['POST'])
@authentication.login_required
def buy():
    company = request.json.get('company')
    price = request.json.get('price')
    quantity = request.json.get('quantity')
    _type = request.json.get('type')
    user = g.user.__dict__['id']

    listing = Listings.query.filter_by(id = company).first()
    if not listing:
        return jsonify({'status' : 'error', 'message' : 'Invalid company.'})

    #add to transaction
    transaction = Transactions()
    transaction.company = company
    transaction.transaction_type = 'buy'
    transaction.price = price
    transaction.transaction_time = datetime.datetime.utcnow()
    transaction.quantity = quantity
    transaction.user = user
    transaction.stock_type = _type
    db.session.add(transaction)
    db.session.commit()

    #change portfolio
    portfolio = Portfolio.query.filter_by(company = company, user = user).first()

    if not portfolio:
        portfolio = Portfolio()
        portfolio.user = user
        portfolio.company = company
        portfolio.quantity = quantity
        portfolio.average_price = price
        db.session.add(portfolio)
    
    else:
        portfolio_dict = portfolio.__dict__
        portfolio.average_price = ((portfolio_dict['average_price'] * portfolio_dict['quantity']) + (price * quantity)) / (portfolio_dict['quantity'] + quantity)
        portfolio.quantity = portfolio_dict['quantity'] + quantity

    db.session.commit()
    return jsonify({'status' : 'success', 'message' : 'Transaction added successfully.'})


@portfolio.route('/sell', methods=['POST'])
@authentication.login_required
def sell():
    company = request.json.get('company')
    price = request.json.get('price')
    quantity = request.json.get('quantity')
    user = g.user.__dict__['id']

    #change portfolio
    portfolio = Portfolio.query.filter_by(company = company, user = user).first()

    if not portfolio:
        return jsonify({'status' : 'error', 'message' : 'You do not have enough shares to sell.'})
    
    portfolio_dict = portfolio.__dict__
    if portfolio_dict['quantity'] <  quantity:
        return jsonify({'status' : 'error', 'message' : 'You do not have enough shares to sell.'})
    else:
        remaining_quantity = portfolio_dict['quantity'] - quantity
        portfolio.quantity = remaining_quantity
        if remaining_quantity == 0:
            portfolio.average_price = 0

    db.session.commit()

    #add to transaction
    transaction = Transactions()
    transaction.company = company
    transaction.transaction_type = 'sell'
    transaction.price = price
    transaction.transaction_time = datetime.datetime.utcnow()
    transaction.quantity = quantity
    transaction.user = user
    db.session.add(transaction)
    db.session.commit()
   
    return jsonify({'status' : 'success', 'message' : 'Transaction added successfully.'})

@portfolio.route("/get-portfolio", methods=['GET'])
@authentication.login_required
def get_portfoio():
    current_user = g.user.__dict__
    portfolio = db.session.query(Portfolio, Listings).join(Listings).filter(Portfolio.user == current_user['id'], Portfolio.quantity > 0)

    result = []
    for p in portfolio:
        portfolio = p[0].__dict__
        listing = p[1].__dict__
        result.append({
            'companyName' : listing['name'],
            'companyId' : listing['id'][:],
            'currentPrice' : listing['price'],
            'rateTime' : listing['rate_time'].replace(tzinfo=pytz.utc).astimezone(pytz.timezone('Asia/Kathmandu')),
            'change' : listing['change'],
            'averagePrice' : portfolio['average_price'],
            'quantity' : portfolio['quantity']
        })

    return jsonify(result)

@portfolio.route("/get-companies", methods=['GET'])
@authentication.login_required
def get_companies():
    result = []
    for l in Listings.query.all():
        listing = l.__dict__
        result.append({
            'id': listing['id'],
            'name': listing['name']
        })
    return jsonify(result)
