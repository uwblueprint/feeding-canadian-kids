import graphene

from .types import (
    Mutation,
    MutationList,
)
from ..graphql.services import services

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
