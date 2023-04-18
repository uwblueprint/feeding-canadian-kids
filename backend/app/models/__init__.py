from mongoengine import connect
import mongomock
import pymongo


def init_app(app):
    app.app_context().push()
    # connect to MongoDB
    mongo_client = (
        mongomock.MongoClient
        if "USE_MONGOMOCK_CLIENT" in app.config
        else pymongo.MongoClient
    )
    if "MONGODB_URL" in app.config:
        connect(host=app.config["MONGODB_URL"], mongo_client_class=mongo_client)
