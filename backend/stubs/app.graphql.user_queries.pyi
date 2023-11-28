from app.graphql.types import User
from graphql.type.definition import GraphQLResolveInfo
from typing import List


class UserQueries:
    def resolve_getAllUsers(
        self,
        info: GraphQLResolveInfo,
        first: int,
        offset: int,
        role: str
    ) -> List[User]: ...
    def resolve_getUserById(self, info: GraphQLResolveInfo, id: str) -> User: ...
