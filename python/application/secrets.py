from os import environ as env

DB_IP = env.get('TANGO_DB_IP') or ''
DB_PORT = env.get('TANGO_DB_PORT') or ''
DB_USER = env.get('TANGO_DB_USER') or ''
DB_PASSWORD = env.get('TANGO_DB_PASSWORD') or ''
DB_NAME = env.get('TANGO_DB_NAME') or ''
SECRET_KEY = env.get('TANGO_SECRET_KEY') or ''

# Note: You should put these into CircleCI Environment Variables.
