import os

from pymongo import MongoClient

env = os.environ.get("ENV", default='prod')

mongoPort = 27017
mongoConfigUri = "MONGO_URI_LOCAL" if env == "local" else "MONGO_URI"
mongoUri = os.environ.get(mongoConfigUri, default='13.51.136.85')

client = MongoClient(mongoUri, mongoPort)
db = client["admin"]


def init_db():
    try:
        db_users = db.command('usersInfo')
        if not db_users["users"]:
            create_user()
            grant_roles()
            insert_test()
            db_users = db.command('usersInfo')
    except Exception as e:
        db_users = repr(e)
    # noinspection PyTypeChecker
    print(f"{env} - {mongoUri}:{mongoPort}, mongo main user: {db_users['users'][0]['_id']}")


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
