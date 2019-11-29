from . import secrets

class Config(object):
    DEBUG = True
    TESTING = False
    DB_IP = secrets.DB_IP
    DB_PORT = secrets.DB_PORT
    DB_USER = secrets.DB_USER
    DB_PASSWORD = secrets.DB_PASSWORD
    DB_NAME = secrets.DB_NAME

class ProductionConfig(Config):
    DEBUG = False

class DevelopmentConfig(Config):
    DEBUG = True

class DevelopmentConfig(Config):
    TESTING = True
