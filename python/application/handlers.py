from .data import Data


def tango(req):
    words = Data.getList()
    words = list(map(lambda x: x['kanji'], words))
    return ', '.join(words)


def hello_world(req):
    return 'Hello, world!'
