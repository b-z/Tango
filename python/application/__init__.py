from flask import Flask

from . import config, routes


def create_app():
    app = Flask(__name__)

    config.setup(app, config.DevelopmentConfig)
    routes.setup(app)

    return app
