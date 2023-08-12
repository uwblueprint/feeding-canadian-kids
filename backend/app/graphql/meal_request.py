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


# Response Types
class MealRequestTypeResponse(graphene.ObjectType):
    portions = graphene.Int(required=True)
    dietary_restrictions = graphene.String(required=True)
    meal_suggestions = graphene.String(required=True)


class CreateMealRequestResponse(graphene.ObjectType):
    id = graphene.ID()
    donation_date = graphene.Date()
    status = graphene.String()


class CreateMealRequestGroupResponse(graphene.ObjectType):
    id = graphene.ID()
    description = graphene.String()
    requests = graphene.List(CreateMealRequestResponse)
    meal_info = graphene.Field(MealRequestTypeResponse)
    status = graphene.String()


class MealTypeInput(graphene.InputObjectType):
    portions = graphene.Int(required=True)
    dietary_restrictions = graphene.String(required=True)
    meal_suggestions = graphene.String(required=True)


# Mutations
class CreateMealRequestGroup(Mutation):
    class Arguments:
        description = graphene.String(required=True)
        requestor = graphene.ID(required=True)
        # request_dates is a list of dates
        request_dates = graphene.List(graphene.Date, required=True)

        meal_info = MealTypeInput(required=True)
        drop_off_time = graphene.Time(required=True)
        drop_off_location = graphene.String(required=True)
        delivery_instructions = graphene.String()
        onsite_staff = graphene.List(ContactInput, required=True)

    # return values
    meal_request_group = graphene.Field(CreateMealRequestGroupResponse)

    def mutate(
        self,
        info,
        description,
        requestor,
        request_dates,
        meal_info,
        drop_off_time,
        drop_off_location,
        delivery_instructions,
        onsite_staff,
    ):
        result = services["meal_request_service"].create_meal_request_group(
            description=description,
            requestor=requestor,
            request_dates=request_dates,
            meal_info=meal_info,
            drop_off_time=drop_off_time,
            drop_off_location=drop_off_location,
            delivery_instructions=delivery_instructions,
            onsite_staff=onsite_staff,
        )

        return CreateMealRequestGroup(meal_request_group=result)


class MealRequestMutations(MutationList):
    create_meal_request_group = CreateMealRequestGroup.Field()
