import pymongo


class Database(object):

    def setup(self, app):
        self.ip = app.config['DB_IP']
        self.port = app.config['DB_PORT']
        self.user = app.config['DB_USER']
        self.password = app.config['DB_PASSWORD']
        self.name = app.config['DB_NAME']

    def connect(self):
        cfg = 'mongodb://{}:{}@{}:{}/'.format(
            self.user,
            self.password,
            self.ip,
            self.port
        )
        self.client = pymongo.MongoClient(cfg)[self.name]


class Data(object):

    DB = Database()

    @classmethod
    def getList(self):
        collection = self.DB.client.words
        results = collection.find({})
        return results
