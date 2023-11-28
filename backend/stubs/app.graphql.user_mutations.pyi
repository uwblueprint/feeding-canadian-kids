from graphql.type.definition import GraphQLResolveInfo


class ActivateUserByID:
    def mutate(
        self,
        info: GraphQLResolveInfo,
        requestor_id: str,
        id: str
    ) -> ActivateUserByID: ...


class DeactivateUserByID:
    def mutate(
        self,
        info: GraphQLResolveInfo,
        requestor_id: str,
        id: str
    ) -> DeactivateUserByID: ...
