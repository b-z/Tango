from flask import Flask

# import secrets
from . import config


def create_app():
    app = Flask(__name__)

    app.config.from_object(config.DevelopmentConfig)

    @app.route('/hello')
    def hello_world():
        return 'Hello, World!'

    return app
