import graphene

from ..types import (
    QueryList,
)
from ...graphql.services import services

# Response types
class GeoLocationQueryResponse(graphene.ObjectType):
    latitude = graphene.Float(required=True)
    longitude = graphene.Float(required=True)
class MealTypeQueryResponse(graphene.ObjectType):
    tags = graphene.List(graphene.String)
    portions = graphene.Int()
    portions_fulfilled = graphene.Int()

class FoodRequestQueryResponse(graphene.ObjectType):
    id = graphene.ID()
    donor = graphene.ID()
    target_fulfillment_date = graphene.DateTime()
    actual_fulfillment_date = graphene.DateTime()
    meal_types = graphene.List(MealTypeQueryResponse)
    status = graphene.String()

class FoodRequestGroupQueryResponse(graphene.ObjectType):
    id = graphene.ID()
    description = graphene.String()
    location = graphene.Field(GeoLocationQueryResponse)
    requestor = graphene.ID()
    requests = graphene.List(FoodRequestQueryResponse)
    status = graphene.String()
    date_created = graphene.DateTime()
    date_updated = graphene.DateTime()
    notes = graphene.String()

class FoodRequestQueries(QueryList):
    food_request_groups = graphene.Field(
        graphene.List(FoodRequestGroupQueryResponse),
        limit=graphene.Int(default_value=10),
        offset=graphene.Int(default_value=0),
        status=graphene.String(),
    )
    food_request_groups_by_user = graphene.Field(
        graphene.List(FoodRequestGroupQueryResponse),
        limit=graphene.Int(default_value=10),
        offset=graphene.Int(default_value=0),
        user_id=graphene.String(required=True),
        status=graphene.String(),
    )

    def resolve_food_request_groups(self, info, limit, offset, status=None):
        user = services["user_service"].get_user_by_id(info.context.user_id)
        is_matched, near_location = None, None
        if user.role == "Donor":
            is_matched = False
            # TODO: how do we get the donor's location?
            # TODO: convert from PointField to [lat, long]
            near_location = user.location
        return services["food_request_service"].get_food_request_groups(limit=limit, offset=offset, status=status, is_matched=is_matched, near_location=near_location)
    
    def resolve_food_request_groups_by_user(self, info, limit, offset, user_id, status=None):
        user_role = services["user_service"].get_user_by_id(user_id).role
        return services["food_request_service"].get_food_request_groups_by_user(limit=limit, offset=offset, user_id=user_id, user_role=user_role, status=status)
