from flask import request

from . import handlers


def setup(app):
    """Setup routes.

    Setup routes, so that user can access the designed endpoints through
    clients.

    Args:
        app: The Flask app object.
    """

    @app.route('/')
    def tango():
        return handlers.tango(request)

    @app.route('/hello')
    def hello_world():
        return handlers.hello_world(request)
