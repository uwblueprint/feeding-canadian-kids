from mongoengine import connect


def init_app(app):
    app.app_context().push()
    # connect to MongoDB
    if "MONGODB_URL" in app.config:
        connect(host=app.config["MONGODB_URL"])
        print("mongo connected")
