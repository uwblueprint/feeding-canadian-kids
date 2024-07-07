from datetime import datetime, timezone
import os
import re
import firebase_admin

from flask import Flask
from flask_cors import CORS
from .graphql.view import GraphQLView
from logging.config import dictConfig

from .config import app_config
from .graphql import schema as graphql_schema


from flask_apscheduler import APScheduler


required_env_vars = [
    "FIREBASE_WEB_API_KEY",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_STORAGE_DEFAULT_BUCKET",
    "FIREBASE_SVC_ACCOUNT_PRIVATE_KEY_ID",
    "FIREBASE_SVC_ACCOUNT_PRIVATE_KEY",
    "FIREBASE_SVC_ACCOUNT_CLIENT_EMAIL",
    "FIREBASE_SVC_ACCOUNT_CLIENT_ID",
    "FIREBASE_SVC_ACCOUNT_AUTH_URI",
    "FIREBASE_SVC_ACCOUNT_TOKEN_URI",
    "FIREBASE_SVC_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL",
    "FIREBASE_SVC_ACCOUNT_CLIENT_X509_CERT_URL",
    "ADMIN_CC_EMAIL",
    "GOOGLE_API_KEY",
    "GEOCODING_API_KEY",
    "USE_GOOGLE_API",
    "FLASK_CONFIG" "FLASK_APP",
    "PYTHONUNBUFFERED",
    "MAILER_CLIENT_SECRET",
    "MAILER_CLIENT_ID",
    "MAILER_REFRESH_TOKEN",
    "MAILER_USER",
    "MG_DB_NAME",
    "MG_DATABASE_URL",
]


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
    print("right before entering config setup ")
    print("type config name", type(config_name))
    # if type(config_name) is not ScriptInfo:
    print("Right before reading config object right now!")
    print("At this time the env vars are: ")
    print("MG_DATABASE_URL:", os.getenv("MG_DATABASE_URL"))
    print("MG_DB_NAME:", os.getenv("MG_DB_NAME"))
    print("config name is", config_name)
    print("app config is", app_config)
    app.config.from_object(app_config[config_name])
    print("Now, app.config is", app.config)
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
        "https://feeding-canadian-kids-staging.firebaseapp.com",
        "https://feeding-canadian-kids-staging.web.app",
        re.compile(r"^https:\/\/feeding-canadian-kids-staging--pr.*\.web\.app$"),
    ]
    app.config["CORS_SUPPORTS_CREDENTIALS"] = True
    app.config["SCHEDULER_API_ENABLED"] = True
    CORS(app)
    for env_var in required_env_vars:
        not_found_one = False
        missing = []
        print(f"variable: {env_var} is {os.getenv(env_var)}")
        if (env_var not in os.environ or os.getenv(env_var) is None) and not app.config[
            "TESTING"
        ]:
            not_found_one = True
            missing.append(env_var)

    if not_found_one:
        all_missing = ", ".join(missing)
        raise Exception(f"Missing required environment variable(s): {all_missing}")

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

    # checks every hour for meal requests that were either yesterday or today and sends an email to the donor and requestor
    @scheduler.task(
        "interval", id="daily_job", seconds=60 * 60 * 24, misfire_grace_time=900
    )
    def dailyJob():
        try:
            with scheduler.app.app_context():
                services["reminder_email_service"].send_regularly_scheduled_emails()
                services[
                    "meal_request_service"
                ].update_meal_request_statuses_to_fulfilled(datetime.now(timezone.utc))
        except Exception as e:
            print("Error in Scheduled Task!", e)

    scheduler.start()

    return app
