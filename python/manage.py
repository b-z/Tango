#!/usr/bin/env python3
import os

from flask_script import Manager, Server, Command
from flask_script.commands import ShowUrls, Clean
from application import create_app

app = create_app()
manager = Manager(app)
manager.add_command("server", Server(host="0.0.0.0", port=80))
manager.add_command("urls", ShowUrls())
manager.add_command("clean", Clean())

if __name__ == "__main__":
    manager.run()
