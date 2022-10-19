import graphene

from flask import current_app
from .example import ExampleQueries, ExampleMutations
from .auth import AuthMutations
from .services import services
from ..services.implementations.auth_service import AuthService

from .services import services

class RootQuery(
    # All queries listed here will be merged.
    ExampleQueries,
):
    pass


class RootMutation(
    # All mutations listed here will be merged.
    ExampleMutations,
    AuthMutations,
):
    pass


schema = graphene.Schema(
    query=RootQuery,
    mutation=RootMutation,
)

def init_app(app):
    with app.app_context():
        # Add your services here: services["service_name"] = ...
        # services["auth_service"] = AuthService(logger=current_app.logger)
        pass
