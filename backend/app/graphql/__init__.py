import graphene

from .onboarding_request import OnboardingRequestMutations
from .example import ExampleQueries, ExampleMutations


class RootQuery(
    # All queries listed here will be merged.
    ExampleQueries,
):
    pass


class RootMutation(
    # All mutations listed here will be merged.
    ExampleMutations,
    OnboardingRequestMutations,
):
    pass


schema = graphene.Schema(
    query=RootQuery,
    mutation=RootMutation,
)
