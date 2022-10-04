import graphene

from .example import ExampleQueries, ExampleMutations


class Query(
    # All queries listed here will be merged.
    ExampleQueries,
):
    pass


class Mutation(
    # All mutations listed here will be merged.
    ExampleMutations,
):
    pass


schema = graphene.Schema(
    query=Query,
    mutation=Mutation,
)
