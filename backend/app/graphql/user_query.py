import graphene
from services.implementations.user_service import UserService
from models.user import User
from .error_handling import ClientError
from .types import (
    Query,
    QueryList,
    Mutation,
    MutationList,
)

# Queries

class userQueries(QueryList):
    users = graphene.List(User, size=graphene.Int(default_value=1)) # add other filters

    def resolve_users(self, info, size): # add other filters
        return UserService.get_users