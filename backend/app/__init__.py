import os
import re
import firebase_admin
from app.models.meal_request import MealRequest

from flask import Flask
from flask.cli import ScriptInfo
from flask_cors import CORS
from .graphql.view import GraphQLView
from logging.config import dictConfig

from .config import app_config
from .graphql import schema as graphql_schema



from flask_apscheduler import APScheduler
from flask import g

def create_app(config_name):
    dictConfig(
        {
            "version": 1,
            "handlers": {
                "wsgi": {
                    "class": "logging.FileHandler",
                    "level": "ERROR",
                    "filename": "error.log",
                    "formatter": "default",
                }
            },
            "formatters": {
                "default": {
                    "format": "%(asctime)s-%(levelname)s-%(name)s::%(module)s,%(lineno)s: %(message)s"  # noqa
                },
            },
            "root": {"level": "ERROR", "handlers": ["wsgi"]},
            "loggers": {"app.graphql.error_handling": {"level": "INFO"}},
        }
    )

    app = Flask(__name__, template_folder="templates", static_folder="static")
    # do not read config object if creating app from Flask CLI (e.g. flask db migrate)
    if type(config_name) is not ScriptInfo:
        app.config.from_object(app_config[config_name])

    app.add_url_rule(
        "/graphql",
        view_func=GraphQLView.as_view(
            "graphql",
            schema=graphql_schema,
            graphiql=True,
        ),
    )

    app.config["CORS_ORIGINS"] = [
        "http://localhost:3000",
        "https://uw-blueprint-starter-code.firebaseapp.com",
        "https://uw-blueprint-starter-code.web.app",
        re.compile(r"^https:\/\/uw-blueprint-starter-code--pr.*\.web\.app$"),
    ]
    app.config["CORS_SUPPORTS_CREDENTIALS"] = True
    app.config["SCHEDULER_API_ENABLED"] = True
    CORS(app)

    firebase_admin.initialize_app(
        firebase_admin.credentials.Certificate(
            {
                "type": "service_account",
                "project_id": os.getenv("FIREBASE_PROJECT_ID"),
                "private_key_id": os.getenv("FIREBASE_SVC_ACCOUNT_PRIVATE_KEY_ID"),
                "private_key": os.getenv("FIREBASE_SVC_ACCOUNT_PRIVATE_KEY").replace(
                    "\\n", "\n"
                ),
                "client_email": os.getenv("FIREBASE_SVC_ACCOUNT_CLIENT_EMAIL"),
                "client_id": os.getenv("FIREBASE_SVC_ACCOUNT_CLIENT_ID"),
                "auth_uri": os.getenv("FIREBASE_SVC_ACCOUNT_AUTH_URI"),
                "token_uri": os.getenv("FIREBASE_SVC_ACCOUNT_TOKEN_URI"),
                "auth_provider_x509_cert_url": os.getenv(
                    "FIREBASE_SVC_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL"
                ),
                "client_x509_cert_url": os.getenv(
                    "FIREBASE_SVC_ACCOUNT_CLIENT_X509_CERT_URL"
                ),
            }
        ),
        {"storageBucket": os.getenv("FIREBASE_STORAGE_DEFAULT_BUCKET")},
    )

    from . import models, graphql

    models.init_app(app)
    services = graphql.init_app(app)

    scheduler = APScheduler()
    scheduler.init_app(app)

    @scheduler.task('interval', id='do_job_1', seconds=6000, misfire_grace_time=900)
    def job1():
        try:
            with scheduler.app.app_context():
                services["reminder_email_service"].send_regularly_scheduled_emails()
        except Exception as e:
            print("Error in Scheduled Task!", e)

    scheduler.start()



    return app

