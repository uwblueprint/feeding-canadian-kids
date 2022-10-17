import graphene

from .example import ExampleQueries, ExampleMutations
from .auth import AuthMutations


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
