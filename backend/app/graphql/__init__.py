import graphene

from .example import ExampleQueries, ExampleMutations
from .auth import Login, Register, Refresh, Logout, ResetPassword

class RootQuery(
    # All queries listed here will be merged.
    ExampleQueries,
):
    pass


class RootMutation(
    # All mutations listed here will be merged.
    ExampleMutations,
    Login,
    Register,
    Refresh,
    Logout,
    ResetPassword,
):
    pass


schema = graphene.Schema(
    query=RootQuery,
    mutation=RootMutation,
)
