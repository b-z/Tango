import os

from flask import Flask

def create_app():
    app = Flask(__name__)

    app.config['DEBUG'] = True

    @app.route('/hello')
    def hello_world():
        return 'Hello, World!'

    return app