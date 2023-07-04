import graphene

from .types import (
    ContactInput,
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


class CreateFoodRequest(graphene.InputObjectType):
    id = graphene.ID()
    donation_date = graphene.DateTime(required=True)
    status = graphene.String(required=True)
    donor_id = graphene.ID(required=True)
    commitment_date = graphene.DateTime(required=True)


class MealTypeInput(graphene.InputObjectType):
    portions = graphene.Int(required=True)
    dietary_restrictions = graphene.String(required=True)
    meal_suggestions = graphene.String(required=True)


# Mutations
class CreateFoodRequestGroup(Mutation):
    class Arguments:
        description = graphene.String(required=True)
        requestor = graphene.ID(required=True)
        requests = graphene.List(CreateFoodRequest, required=True)
        status = graphene.String(required=True)

        meal_info = MealTypeInput(required=True)
        frequency = graphene.String(required=True)
        days = graphene.List(graphene.String, required=True)
        drop_off_time = graphene.DateTime(required=True)
        drop_off_location = graphene.String(required=True)
        delivery_instructions = graphene.String()
        onsite_staff = graphene.List(ContactInput, required=True)

        start_date = graphene.DateTime(required=True)
        end_date = graphene.DateTime(required=True)

    # return values
    food_request_group = graphene.Field(CreateFoodRequestGroupResponse)

    def mutate(
        self,
        info,
        description,
        requestor,
        requests,
        status,
        meal_info,
        frequency,
        days,
        drop_off_time,
        drop_off_location,
        delivery_instructions,
        onsite_staff,
        start_date,
        end_date,
    ):
        result = services["food_request_service"].create_food_request_group(
            description=description,
            requestor=requestor,
            requests=requests,
            status=status,
            meal_info=meal_info,
            frequency=frequency,
            days=days,
            drop_off_time=drop_off_time,
            drop_off_location=drop_off_location,
            delivery_instructions=delivery_instructions,
            onsite_staff=onsite_staff,
            start_date=start_date,
            end_date=end_date,
        )

        return CreateFoodRequestGroup(food_request_group=result)


class FoodRequestMutations(MutationList):
    create_food_request_group = CreateFoodRequestGroup.Field()
