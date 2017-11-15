from functools import wraps
from flask import g,abort
from application import app

def requires_admin(func):
    @wraps(func)
    def decorated_function(*args,**kwargs):
        if not g.user.__dict__['role']:
            abort(401)
        if g.user.__dict__['role'].lower() != 'admin':
            abort(401)
        
        return func(*args,**kwargs)

    return decorated_function


@app.after_request
def refresh_token(response): 
    try:
        response.headers.add('Refresh-Token', g.user.generate_auth_token(6000).decode('ascii'))
        response.headers.add('Access-Control-Expose-Headers', 'Refresh-Token')
    except:
        return response
    return response