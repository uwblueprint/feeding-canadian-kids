import os


class Config(object):
    """
    Common configurations
    """

    # put any configurations here that are common across all environments
    # list of available configs: https://flask.palletsprojects.com/en/1.1.x/config/
    # print("running thiS in config!")
    # print("python version", sys.version)
    # print("MG_DATABASE_URL:", os.getenv("MG_DATABASE_URL"))
    # print("MG_DB_NAME:", os.getenv("MG_DB_NAME"))

    MONGODB_URL = os.getenv("MG_DATABASE_URL")
    MONGODB_DB_NAME = os.getenv("MG_DB_NAME")


class DevelopmentConfig(Config):
    """
    Development configurations
    """

    DEBUG = True


class ProductionConfig(Config):
    """
    Production configurations
    """

    DEBUG = False


class TestingConfig(Config):
    """
    Testing configurations
    """

    DEBUG = False
    TESTING = True
    MONGODB_URL = "mongodb://localhost"
    USE_MONGOMOCK_CLIENT = True


app_config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}
