import os
import logging
from flask_cors import CORS

from pymongo import MongoClient

env = os.environ.get("environment", default='prod')

mongoPort = 27017
mongoConfigUri = "MONGO_URI_LOCAL" if env == "local" else "MONGO_URI"
mongoUri = os.environ.get(mongoConfigUri, default='13.61.144.29')

client = MongoClient(mongoUri, mongoPort)
db = client["admin"]
global logger


def init_app(app):
    enable_cors_for_local_docker(app)
    global logger
    logger = app.logger
    logger.setLevel(logging.INFO)
    logger.info(f"{env} - {mongoUri}:{mongoPort}")
    get_db_users(app)


def get_hello_db():
    try:
        data = client.test.command('ping')
        logger.info(f"{env} - {mongoUri}:{mongoPort}")
    except Exception as e:
        data = repr(e)
    return data


def get_db_users(app):
    try:
        db_users = db.command('usersInfo')
        app.logger.info(f"DB users: {db_users}")
        if not db_users["users"]:
            create_user()
            grant_roles()
            insert_test()
            db_users = db.command('usersInfo')
            app.logger.info(f"DB users: {db_users}")
    except Exception as e:
        app.logger.error(repr(e))


def enable_cors_for_local_docker(app):
    if env == 'local':
        CORS(app)


def grant_roles():
    db.command({
        "grantRolesToUser": "user_admin",
        "roles": [
            {"role": "userAdminAnyDatabase", "db": "admin"},
            {"role": "dbAdminAnyDatabase", "db": "admin"},
            {"role": "readWriteAnyDatabase", "db": "admin"}
        ]
    })


def create_user():
    db.command({
        "createUser": "user_admin",
        "pwd": "user_pass",
        "roles": [
            {"role": "userAdminAnyDatabase", "db": "admin"},
            {"role": "readWriteAnyDatabase", "db": "admin"},
            {"role": "dbAdminAnyDatabase", "db": "admin"}
        ]})


def insert_test():
    db.recipe.insert_one({
        "name": "Test",
        "ingredients": [
            "hello",
            "world"
        ],
        "instructions": "Hello, World!",
        "id": "1"
    })
