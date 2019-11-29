from flask import Flask

from . import config, routes
from .data import Data


def create_app():
    app = Flask(__name__)

    config.setup(app, config.DevelopmentConfig)
    routes.setup(app)
    Data.DB.setup(app)
    Data.DB.connect()

    return app
