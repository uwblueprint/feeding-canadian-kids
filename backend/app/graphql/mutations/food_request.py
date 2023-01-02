import graphene

from ..types import (
    Mutation,
    MutationList,
)
from ..services import services
from ..shared import GeoLocationInput, GeoLocationResponse

# Input Types


class ASPContactInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    email = graphene.String(required=True)
    phone = graphene.String()


class CreateFoodRequestInput(graphene.InputObjectType):
    dates = graphene.List(graphene.DateTime, required=True)
    location = graphene.Argument(GeoLocationInput, required=True)
    requestor_id = graphene.ID(required=True)
    contacts = graphene.List(ASPContactInput, required=True)
    portions = graphene.Int(required=True)
    dietary_restrictions = graphene.String(required=True)
    delivery_notes = graphene.String(required=True)


# Response Types


class ASPContactResponse(graphene.ObjectType):
    name = graphene.String(required=True)
    email = graphene.String(required=True)
    phone = graphene.String()


class CreateFoodRequestResponse(graphene.ObjectType):
    id = graphene.ID()
    date = graphene.DateTime()
    location = graphene.Field(GeoLocationResponse)
    requestor_id = graphene.ID()
    contacts = graphene.List(ASPContactResponse)
    portions = graphene.Int()
    portions_fulfilled = graphene.Int()
    dietary_restrictions = graphene.String()
    delivery_notes = graphene.String()
    date_created = graphene.DateTime()
    date_updated = graphene.DateTime()
    date_fulfilled = graphene.DateTime()


# Mutations
class CreateFoodRequests(Mutation):
    class Arguments:
        food_request_data = CreateFoodRequestInput(required=True)

    # return values
    food_requests = graphene.List(CreateFoodRequestResponse)

    def mutate(self, info, food_request_data):
        result = services["food_request_service"].create_food_requests(
            food_request_data
        )
        return CreateFoodRequests(food_requests=result)


class FoodRequestMutations(MutationList):
    create_food_requests = CreateFoodRequests.Field()
