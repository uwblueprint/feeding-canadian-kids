from mongoengine import connect


def init_app(app):
    from .entity import Entity
    from .simple_entity import SimpleEntity
    from .user import User

    app.app_context().push()
    # connect to MongoDB
    if "MONGODB_URL" in app.config:
        connect(host=app.config["MONGODB_URL"])
