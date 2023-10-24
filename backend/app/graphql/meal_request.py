import graphene
from datetime import datetime
from dateutil.relativedelta import relativedelta

from .types import (
    ContactInput,
    Contact,
    Mutation,
    MutationList,
    QueryList,
    SortDirection,
)

from ..models.meal_request import MealStatus, MEAL_STATUSES
from ..graphql.services import services

# Input Types


class MealRequestTypeInput(graphene.InputObjectType):
    tags = graphene.List(graphene.String, required=True)
    portions = graphene.Int(required=True)


class MealTypeInput(graphene.InputObjectType):
    portions = graphene.Int(required=True)
    dietary_restrictions = graphene.String(default_value=None)
    meal_suggestions = graphene.String(default_value=None)


# Response Types
class MealInfoResponse(graphene.ObjectType):
    portions = graphene.Int(required=True)
    dietary_restrictions = graphene.String()
    meal_suggestions = graphene.String()


class CreateMealRequestResponse(graphene.ObjectType):
    id = graphene.ID()
    drop_off_datetime = graphene.DateTime(required=True)
    status = graphene.String(required=True)
    description = graphene.String(required=True)
    meal_info = graphene.Field(MealInfoResponse, required=True)


# Mutations
class CreateMealRequests(Mutation):
    class Arguments:
        description = graphene.String(required=True)
        requestor = graphene.ID(required=True)
        # request_dates is a list of dates
        request_dates = graphene.List(graphene.Date, required=True)

        meal_info = MealTypeInput(required=True)
        drop_off_time = graphene.Time(required=True)
        drop_off_location = graphene.String(required=True)
        delivery_instructions = graphene.String(default_value=None)
        onsite_staff = graphene.List(ContactInput, required=True)

    # return values
    meal_requests = graphene.List(CreateMealRequestResponse)

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
        result = services["meal_request_service"].create_meal_request(
            description=description,
            requestor=requestor,
            request_dates=request_dates,
            meal_info=meal_info,
            drop_off_time=drop_off_time,
            drop_off_location=drop_off_location,
            delivery_instructions=delivery_instructions,
            onsite_staff=onsite_staff,
        )

        return CreateMealRequests(meal_requests=result)


class MealRequestMutations(MutationList):
    create_meal_request = CreateMealRequests.Field()


class DonationInfo(graphene.ObjectType):
    donor = graphene.ID()
    commitment_date = graphene.DateTime()
    meal_description = graphene.String()
    additional_info = graphene.String()


class MealRequestResponse(graphene.ObjectType):
    id = graphene.ID()
    requestor = graphene.ID()
    description = graphene.String()  # is this needed?
    status = graphene.String()
    drop_off_datetime = graphene.DateTime()
    drop_off_location = graphene.String()
    meal_info = graphene.Field(MealInfoResponse)
    onsite_staff = graphene.List(
        Contact,
    )
    date_created = graphene.DateTime()
    date_updated = graphene.DateTime()
    delivery_instructions = graphene.String()
    donation_info = graphene.Field(DonationInfo)


# Queries
class MealRequestQueries(QueryList):
    getMealRequestByRequestorId = graphene.List(
        MealRequestResponse,
        requestor_id=graphene.ID(required=True),
        min_drop_off_date=graphene.Date(
            default_value=datetime.today().replace(day=1)
        ),  # first day of the month
        max_drop_off_date=graphene.Date(
            default_value=(datetime.today() + relativedelta(day=31))
        ),  # last day of the month
        status=graphene.List(
            graphene.Enum.from_enum(MealStatus),
            default_value=MEAL_STATUSES,
        ),
        offset=graphene.Int(default_value=0),
        limit=graphene.Int(default_value=10),
        sort_by_date_direction=SortDirection(default_value=SortDirection.ASCENDING),
    )

    def resolve_getMealRequestByRequestorId(
        self,
        info,
        requestor_id,
        min_drop_off_date,
        max_drop_off_date,
        status,
        offset,
        limit,
        sort_by_date_direction,
    ):
        meal_request_dtos = services[
            "meal_request_service"
        ].get_meal_requests_by_requestor_id(
            requestor_id,
            min_drop_off_date,
            max_drop_off_date,
            status,
            offset,
            limit,
            sort_by_date_direction,
        )

        return [
            MealRequestResponse(
                id=meal_request_dto.id,
                requestor=meal_request_dto.requestor,
                description=meal_request_dto.description,
                status=meal_request_dto.status,
                drop_off_datetime=meal_request_dto.drop_off_datetime,
                drop_off_location=meal_request_dto.drop_off_location,
                meal_info=meal_request_dto.meal_info,
                onsite_staff=meal_request_dto.onsite_staff,
                date_created=meal_request_dto.date_created,
                date_updated=meal_request_dto.date_updated,
                delivery_instructions=meal_request_dto.delivery_instructions,
                donation_info=meal_request_dto.donation_info,
            )
            for meal_request_dto in meal_request_dtos
        ]
