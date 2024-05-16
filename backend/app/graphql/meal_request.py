import graphene
from graphql import GraphQLError
from typing import List

from .types import (
    Mutation,
    MutationList,
    OnsiteContact,
    QueryList,
    SortDirection,
    User,
)
from ..models.meal_request import MEAL_STATUSES_ENUMS, MealStatus
from ..graphql.services import services

# Input Types


class MealRequestTypeInput(graphene.InputObjectType):
    tags = graphene.List(graphene.String, required=True)
    portions = graphene.Int(required=True)


class MealTypeInput(graphene.InputObjectType):
    portions = graphene.Int(required=True)
    dietary_restrictions = graphene.String(default_value=None)


# Response Types
class MealInfoResponse(graphene.ObjectType):
    portions = graphene.Int(required=True)
    dietary_restrictions = graphene.String()


class CreateMealRequestResponse(graphene.ObjectType):
    id = graphene.ID()
    drop_off_datetime = graphene.DateTime(required=True)
    status = graphene.Field(graphene.Enum.from_enum(MealStatus), required=True)
    meal_info = graphene.Field(MealInfoResponse, required=True)
    onsite_contacts = graphene.List(OnsiteContact)


class DonationInfo(graphene.ObjectType):
    donor = graphene.Field(User)
    commitment_date = graphene.DateTime()
    meal_description = graphene.String()
    additional_info = graphene.String()
    donor_onsite_contacts = graphene.List(OnsiteContact)


class MealRequestResponse(graphene.ObjectType):
    id = graphene.ID()
    requestor = graphene.Field(User)
    status = graphene.Field(graphene.Enum.from_enum(MealStatus), required=True)
    drop_off_datetime = graphene.DateTime()
    drop_off_location = graphene.String()
    meal_info = graphene.Field(MealInfoResponse)
    onsite_contacts = graphene.List(OnsiteContact)
    date_created = graphene.DateTime()
    date_updated = graphene.DateTime()
    delivery_instructions = graphene.String()
    donation_info = graphene.Field(DonationInfo)


# Mutations
class CreateMealRequests(Mutation):
    class Arguments:
        requestor_id = graphene.ID(required=True)
        # request_dates is a list of dates
        request_dates = graphene.List(graphene.Date, required=True)

        meal_info = MealTypeInput(required=True)
        drop_off_time = graphene.Time(required=True)
        drop_off_location = graphene.String(required=True)
        delivery_instructions = graphene.String(default_value=None)
        onsite_contacts = graphene.List(graphene.String, default_value=[])

    # return values
    meal_requests = graphene.List(CreateMealRequestResponse)

    def mutate(
        self,
        info,
        requestor_id,
        request_dates,
        meal_info,
        drop_off_time,
        drop_off_location,
        delivery_instructions,
        onsite_contacts,
    ):
        result = services["meal_request_service"].create_meal_request(
            requestor_id=requestor_id,
            request_dates=request_dates,
            meal_info=meal_info,
            drop_off_time=drop_off_time,
            drop_off_location=drop_off_location,
            delivery_instructions=delivery_instructions,
            onsite_contacts=onsite_contacts,
        )

        return CreateMealRequests(meal_requests=result)


class UpdateMealRequest(Mutation):
    class Arguments:
        meal_request_id = graphene.ID(required=True)
        requestor_id = graphene.ID(required=False)
        drop_off_datetime = graphene.DateTime(required=False)
        meal_info = MealTypeInput()
        drop_off_location = graphene.String()
        delivery_instructions = graphene.String()
        onsite_contacts = graphene.List(graphene.String)

    # return values
    meal_request = graphene.Field(MealRequestResponse)

    def mutate(
        self,
        info,
        meal_request_id,
        requestor_id: str,
        drop_off_datetime=None,
        meal_info=None,
        drop_off_location=None,
        delivery_instructions=None,
        onsite_contacts=None,
    ):
        result = services["meal_request_service"].update_meal_request(
            requestor_id=requestor_id,
            meal_info=meal_info,
            drop_off_datetime=drop_off_datetime,
            drop_off_location=drop_off_location,
            delivery_instructions=delivery_instructions,
            onsite_contacts=onsite_contacts,
            meal_request_id=meal_request_id,
        )

        return UpdateMealRequest(meal_request=result)


class CommitToMealRequest(Mutation):
    class Arguments:
        requestor = graphene.ID(required=True)
        meal_request_ids = graphene.List(graphene.ID, required=True)
        meal_description = graphene.String(required=True)
        additional_info = graphene.String(default_value=None)
        donor_onsite_contacts = graphene.List(graphene.ID, required=True)

    meal_requests = graphene.List(MealRequestResponse)

    def mutate(
        self,
        info,
        requestor,
        meal_request_ids,
        meal_description,
        additional_info=None,
        donor_onsite_contacts=[]
    ):
        result = services["meal_request_service"].commit_to_meal_request(
            donor_id=requestor,
            meal_request_ids=meal_request_ids,
            meal_description=meal_description,
            additional_info=additional_info,
            donor_onsite_contacts=donor_onsite_contacts
        )

        return CommitToMealRequest(meal_requests=result)


class CancelDonation(Mutation):
    class Arguments:
        meal_request_id = graphene.ID(required=True)
        requestor_id = graphene.String(required=True)

    # return values (return updated meal request)
    meal_request = graphene.Field(MealRequestResponse)

    def mutate(self, info, meal_request_id, requestor_id):
        user = services["user_service"]
        requestor_auth_id = user.get_auth_id_by_user_id(requestor_id)
        requestor_role = user.get_user_role_by_auth_id(requestor_auth_id)

        try:
            if requestor_role != "Admin":
                raise Exception("Only admins can cancel donations")

            meal_request = services["meal_request_service"].cancel_donation(
                meal_request_id
            )
            if not meal_request:
                raise Exception("Meal request not found")
        except Exception as e:
            raise GraphQLError(str(e))

        return CancelDonation(meal_request=meal_request)


class DeleteMealRequest(Mutation):
    class Arguments:
        meal_request_id = graphene.ID(required=True)
        requestor_id = graphene.String(required=True)

    meal_request = graphene.Field(MealRequestResponse)

    def mutate(self, info, meal_request_id, requestor_id):
        user = services["user_service"]
        requestor_auth_id = user.get_auth_id_by_user_id(requestor_id)
        requestor_role = user.get_user_role_by_auth_id(requestor_auth_id)

        try:
            meal_request = services["meal_request_service"].get_meal_request_by_id(
                meal_request_id
            )
            if not meal_request:
                raise Exception("Meal request not found")

            if (requestor_role == "Admin") or (
                meal_request.requestor["id"] == requestor_id
                and not meal_request.donation_info
            ):
                meal_request = services["meal_request_service"].delete_meal_request(
                    meal_request_id
                )
            else:
                raise Exception(
                    "Only admins or requestors who have not found a donor can delete meal requests."
                )

        except Exception as e:
            raise GraphQLError(str(e))

        return DeleteMealRequest(meal_request=meal_request)


class MealRequestMutations(MutationList):
    create_meal_request = CreateMealRequests.Field()
    update_meal_request = UpdateMealRequest.Field()
    commit_to_meal_request = CommitToMealRequest.Field()
    cancel_donation = CancelDonation.Field()
    delete_meal_request = DeleteMealRequest.Field()


class MealRequestQueries(QueryList):
    getMealRequestsByRequestorId = graphene.List(
        MealRequestResponse,
        requestor_id=graphene.ID(required=True),
        min_drop_off_date=graphene.Date(default_value=None),
        max_drop_off_date=graphene.Date(default_value=None),
        # status=graphene.List(graphene.Enum.from_enum(MealStatus)),
        status=graphene.List(
            graphene.Enum.from_enum(MealStatus),
            # MealStatus,
            default_value=MEAL_STATUSES_ENUMS,
        ),
        offset=graphene.Int(default_value=0),
        limit=graphene.Int(default_value=None),
        sort_by_date_direction=SortDirection(default_value=SortDirection.ASCENDING),
    )

    getMealRequestById = graphene.Field(
        MealRequestResponse,
        requestor_id=graphene.ID(required=True),
        id=graphene.ID(required=True),
    )

    getMealRequestsByIds = graphene.Field(
        graphene.List(MealRequestResponse),
        requestor_id=graphene.ID(required=True),
        ids=graphene.List(graphene.ID),
    )

    def resolve_getMealRequestById(
        self,
        info,
        requestor_id: str,
        id: str,
    ):
        meal_request = services["meal_request_service"].get_meal_request_by_id(id)
        return meal_request

    def resolve_getMealRequestsByIds(
        self,
        info,
        requestor_id: str,
        ids: List[str],
    ):
        meal_requests = services["meal_request_service"].get_meal_requests_by_ids(ids)
        return meal_requests

    def resolve_getMealRequestsByRequestorId(
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
                status=meal_request_dto.status,
                drop_off_datetime=meal_request_dto.drop_off_datetime,
                drop_off_location=meal_request_dto.drop_off_location,
                meal_info=meal_request_dto.meal_info,
                onsite_contacts=meal_request_dto.onsite_contacts,
                date_created=meal_request_dto.date_created,
                date_updated=meal_request_dto.date_updated,
                delivery_instructions=meal_request_dto.delivery_instructions,
                donation_info=meal_request_dto.donation_info,
            )
            for meal_request_dto in meal_request_dtos
        ]

    getMealRequestsByDonorId = graphene.List(
        MealRequestResponse,
        donor_id=graphene.ID(required=True),
        min_drop_off_date=graphene.Date(default_value=None),
        max_drop_off_date=graphene.Date(default_value=None),
        status=graphene.List(
            graphene.Enum.from_enum(MealStatus),
            default_value=MEAL_STATUSES_ENUMS,
        ),
        offset=graphene.Int(default_value=0),
        limit=graphene.Int(default_value=None),
        sort_by_date_direction=SortDirection(default_value=SortDirection.ASCENDING),
    )

    def resolve_getMealRequestsByDonorId(
        self,
        info,
        donor_id,
        min_drop_off_date,
        max_drop_off_date,
        status,
        offset,
        limit,
        sort_by_date_direction,
    ):
        meal_request_dtos = services[
            "meal_request_service"
        ].get_meal_requests_by_donor_id(
            donor_id,
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
                status=meal_request_dto.status,
                drop_off_datetime=meal_request_dto.drop_off_datetime,
                drop_off_location=meal_request_dto.drop_off_location,
                meal_info=meal_request_dto.meal_info,
                onsite_contacts=meal_request_dto.onsite_contacts,
                date_created=meal_request_dto.date_created,
                date_updated=meal_request_dto.date_updated,
                delivery_instructions=meal_request_dto.delivery_instructions,
                donation_info=meal_request_dto.donation_info,
            )
            for meal_request_dto in meal_request_dtos
        ]
