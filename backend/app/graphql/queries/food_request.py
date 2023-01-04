import graphene

from ..types import (
    QueryList,
)
from ..services import services
from ...utilities.types import FoodRequestStatus
from ..shared import GeoLocationResponse

# from ..middleware.auth import requires_role

# Response types


class ASPContactQueryResponse(graphene.ObjectType):
    name = graphene.String(required=True)
    email = graphene.String(required=True)
    phone = graphene.String()


class FoodRequestQueryResponse(graphene.ObjectType):
    id = graphene.ID()
    date = graphene.DateTime()
    location = graphene.Field(GeoLocationResponse)
    requestor_id = graphene.ID()
    donor_id = graphene.ID()
    contacts = graphene.List(ASPContactQueryResponse)
    portions = graphene.Int()
    portions_fulfilled = graphene.Int()
    dietary_restrictions = graphene.String()
    delivery_notes = graphene.String()
    status = graphene.String()
    date_created = graphene.DateTime()
    date_updated = graphene.DateTime()
    date_fulfilled = graphene.DateTime()


FoodRequestStatusEnum = graphene.Enum.from_enum(FoodRequestStatus)


class FoodRequestQueries(QueryList):
    food_requests = graphene.Field(
        graphene.List(FoodRequestQueryResponse),
        limit=graphene.Int(default_value=10),
        offset=graphene.Int(default_value=0),
        status=FoodRequestStatusEnum(),
    )
    food_requests_by_user = graphene.Field(
        graphene.List(FoodRequestQueryResponse),
        limit=graphene.Int(default_value=10),
        offset=graphene.Int(default_value=0),
        user_id=graphene.String(required=True),
        status=FoodRequestStatusEnum(),
    )

    # @requires_role(["Donor", "Admin"])
    def resolve_food_requests(self, info, limit, offset, status=None):
        # TODO: figure out firebase stuff
        # user = services["user_service"].get_user_by_id(info.context.user.id)
        # near_location = user.location if user.role == "Donor" else None

        # TODO: remove this
        near_location = {"type": "Point", "coordinates": [43.6544, 79.3807]}
        return services["food_request_service"].get_food_requests(
            limit=limit, offset=offset, status=status, near_location=near_location
        )

    # TODO: figure out why lazy context isn't working
    # @requires_role(["Donor", "ASP"])
    def resolve_food_requests_by_user(self, info, limit, offset, user_id, status=None):
        user_role = services["user_service"].get_user_by_id(user_id).role
        return services["food_request_service"].get_food_requests_by_user(
            limit=limit, offset=offset, user_id=user_id, role=user_role, status=status
        )
