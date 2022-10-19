import graphene

from flask import current_app
from .example import ExampleQueries, ExampleMutations
from .auth import AuthMutations
from .services import services
from ..services.implementations.auth_service import AuthService


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
        pass