import graphene

from .types import (
    Query,
    QueryList,
    Mutation,
    MutationList,
)
from ..graphql.services import services


# Any user can list food requests. This list should be paginated. Visible requests should differ based on the actingRole (parametrize this role for now, we'll figure out how to pass this info from the frontend later on):

# ASPs can view all requests they created, and can filter by status (and potentially other things, if you think it's a good idea to add more filters).
# Donors can list open requests near them. This list should be sorted using some combination of the priority (lower is better) and location fields on the ASP user who created the request (you can add more fields if you want). Donors can view all requests they have ever matched with, and can filter by status (and potentially other things, if you think it's a good idea to add more filters).
# Admins can list all requests, and filter as above.
class GetFoodRequestGroups(Query):

    pass


class FoodRequestQueries(QueryList):
    food_request_groups = graphene.Field(GetFoodRequestGroups)

    def resolve_food_requests(self, info):
        return services["food_request_service"].get_food_request_groups()


# Input Types


class MealRequestTypeInput(graphene.InputObjectType):
    tags = graphene.List(graphene.String, required=True)
    portions = graphene.Int(required=True)


class CreateFoodRequestDatesInput(graphene.InputObjectType):
    date = graphene.DateTime(required=True)
    meal_types = graphene.List(MealRequestTypeInput, required=True)


# Response Types
class MealRequestTypeResponse(graphene.ObjectType):
    tags = graphene.List(graphene.String, required=True)
    portions = graphene.Int(required=True)


class CreateFoodRequestResponse(graphene.ObjectType):
    id = graphene.ID()
    target_fulfillment_date = graphene.DateTime()
    meal_types = graphene.List(MealRequestTypeResponse)
    status = graphene.String()


class CreateFoodRequestGroupResponse(graphene.ObjectType):
    id = graphene.ID()
    description = graphene.String()
    requests = graphene.List(CreateFoodRequestResponse)
    status = graphene.String()


# Mutations
class CreateFoodRequestGroup(Mutation):
    class Arguments:
        description = graphene.String(required=True)
        requestor = graphene.ID(required=True)
        commitments = graphene.List(CreateFoodRequestDatesInput, required=True)

    # return values
    food_request_group = graphene.Field(CreateFoodRequestGroupResponse)

    def mutate(self, info, description, requestor, commitments):
        result = services["food_request_service"].create_food_request_group(
            description=description, requestor=requestor, commitments=commitments
        )
        return CreateFoodRequestGroup(food_request_group=result)


class FoodRequestMutations(MutationList):
    create_food_request_group = CreateFoodRequestGroup.Field()
