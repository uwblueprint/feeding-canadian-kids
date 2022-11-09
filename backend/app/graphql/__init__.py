import graphene

from .example import ExampleQueries, ExampleMutations
from .all_users import AllUsersQuery
from .user import UserQuery


class RootQuery(
    # All queries listed here will be merged.
    ExampleQueries,
    AllUsersQuery,
    UserQuery
):
    pass


class RootMutation(
    # All mutations listed here will be merged.
    ExampleMutations
):
    pass


schema = graphene.Schema(
    query=RootQuery,
    mutation=RootMutation,
)
