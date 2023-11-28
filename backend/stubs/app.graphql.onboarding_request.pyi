from graphql.type.definition import GraphQLResolveInfo
from typing import List


class OnboardingRequestQueries:
    def resolve_getAllOnboardingRequests(
        self,
        info: GraphQLResolveInfo,
        number: int,
        offset: int,
        role: str,
        status: str
    ) -> List[OnboardingRequest]: ...
    def resolve_getOnboardingRequestById(
        self,
        info: GraphQLResolveInfo,
        id: str
    ) -> OnboardingRequest: ...
