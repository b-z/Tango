from flask import Flask
import flask_monitoringdashboard as dashboard

from . import config
from .controllers import routes
from .controllers.data import Data


def create_app(config_object):
    app = Flask(__name__)

    config.setup(app, config_object)
    if not app.config['TESTING']:
        dashboard.config.init_from(file='dashboard_config.cfg')
        dashboard.bind(app)
    routes.setup(app)
    Data.DB.setup(app)
    Data.DB.connect()
    return app
