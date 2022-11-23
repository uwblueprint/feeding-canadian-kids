import graphene

from ..types import (
    QueryList,
)
from ...graphql.services import services

# Response types
class MealTypeQueryResponse(graphene.ObjectType):
    tags = graphene.List(graphene.String)
    portions = graphene.Int()
    portions_fulfilled = graphene.Int()

class FoodRequestQueryResponse(graphene.ObjectType):
    id = graphene.ID()
    target_fulfillment_date = graphene.DateTime()
    actual_fulfillment_date = graphene.DateTime()
    meal_types = graphene.List(MealTypeQueryResponse)
    status = graphene.String()

class FoodRequestGroupQueryResponse(graphene.ObjectType):
    id = graphene.ID()
    description = graphene.String()
    requestor = graphene.ID()
    requests = graphene.List(FoodRequestQueryResponse)
    donor = graphene.ID()
    status = graphene.String()
    date_created = graphene.DateTime()
    date_updated = graphene.DateTime()

class FoodRequestQueries(QueryList):
    food_request_groups = graphene.Field(
        graphene.List(FoodRequestGroupQueryResponse),
        status=graphene.String(),
    )
    food_request_groups_by_user = graphene.Field(
        graphene.List(FoodRequestGroupQueryResponse),
        user_id=graphene.String(required=True),
        status=graphene.String(),
    )

    # @require_authorization_by_role(["Admin", "Donor"])
    def resolve_food_requests_groups(self, info, status):
        user_id = info.context.user_id
        user_role = services["user_service"].get_user_by_id(user_id).role
        is_matched = False if user_role == "Donor" else None
        return services["food_request_service"].get_food_request_groups(status=status, is_matched=is_matched)
    
    # @require_authorization_by_role(["ASP", "Donor"])
    def resolve_food_requests_groups_by_user(self, info, user_id, status):
        user_role = services["user_service"].get_user_by_id(user_id).role
        return services["food_request_service"].get_food_request_groups_by_user(user_id=user_id, user_role=user_role, status=status)
