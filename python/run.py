from flask import Flask

app = Flask(__name__)
@app.route('/')
def hello_world():
    return 'Hello, World!'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)

# Note:
# Here, I can also use      flask run --host=0.0.0.0
# in the command line.

# Note 2:
# DO NOT use development / debug ENV.
