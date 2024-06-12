from mongoengine import connect
import mongomock
import pymongo
import os


def init_app(app):
    app.app_context().push()
    # connect to MongoDB
    mongo_client = (
        mongomock.MongoClient
        if "USE_MONGOMOCK_CLIENT" in app.config
        else pymongo.MongoClient
    )
    print("doing this!!")
    print("MG_DATABASE_URL:", os.getenv("MG_DATABASE_URL"))
    # print("app.config mgdb url", app.config["MONGODB_URL"])
    # print("app.config mg db name", app.config["MONGODB_DB_NAME"])
    print("app.config", app.config)
    print("mongodb url in" , "MONGODB_URL" in app.config )
    print("mongodb db name in" , "MONGODB_DB_NAME" in app.config )
    if "MONGODB_URL" in app.config and "MONGODB_DB_NAME" in app.config:
        connect(
            host=app.config["MONGODB_URL"],
            mongo_client_class=mongo_client,
            db=app.config["MONGODB_DB_NAME"],
        )
    else:
        print("MG_DATABASE_URL:", os.getenv("MG_DATABASE_URL"))
        raise Exception("MG_DATABASE_URL and MG_DB_NAME must be set in the env file.")
