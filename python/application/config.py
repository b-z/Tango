from . import secrets


class Config(object):
    DEBUG = True
    TESTING = False
    SERVER_PORT = 80
    DB_IP = secrets.DB_IP
    DB_PORT = secrets.DB_PORT
    DB_USER = secrets.DB_USER
    DB_PASSWORD = secrets.DB_PASSWORD
    DB_NAME = secrets.DB_NAME


class ProductionConfig(Config):
    DEBUG = False


class DevelopmentConfig(Config):
    DEBUG = True


class TestConfig(Config):
    TESTING = True


def setup(app, config_class):
    app.config.from_object(config_class)
