import os

from pymongo import MongoClient

mongoUri = os.environ.get("MONGO_URI", default='13.51.136.85')

client = MongoClient(mongoUri, 27017)
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
    print(f"{mongoUri}: {db_users}")


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
