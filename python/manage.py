#!/usr/bin/env python3
from flask_script import Manager, Server
from flask_script.commands import ShowUrls, Clean
from application import create_app, config

app = create_app(config.DevelopmentConfig)
manager = Manager(app)
manager.add_command("server", Server(host="0.0.0.0", port=app.config['SERVER_PORT']))
manager.add_command("urls", ShowUrls())
manager.add_command("clean", Clean())

if __name__ == "__main__":
    manager.run()
