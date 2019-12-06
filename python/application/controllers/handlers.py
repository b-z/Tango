from flask import render_template

from .data import Data


def tango(req):
    words = Data.get_list()
    return render_template('list.html', data=words)


def hello_world(req):
    return 'Hello, world!'
