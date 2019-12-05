from flask import Flask

from . import routes, config
from .data import Data


def create_app(config_object):
    app = Flask(__name__)

    config.setup(app, config_object)
    routes.setup(app)
    Data.DB.setup(app)
    Data.DB.connect()

    return app
