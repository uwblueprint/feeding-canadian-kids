import graphene
from graphql import GraphQLError
from mongoengine.errors import NotUniqueError

from ..graphql.services import services

from .types import Mutation, MutationList, QueryList, UserInfo, UserInfoInput

ONBOARDING_REQUEST_EMAIL_ALREADY_EXISTS_ERROR = (
    "Failed to create onboarding request. Reason = Email already exists"
)


class OnboardingRequest(graphene.ObjectType):
    id = graphene.ID()
    info = graphene.Field(UserInfo)
    date_submitted = graphene.DateTime()
    status = graphene.String()


# Queries


# Return object for queries
class OnboardingRequestQueries(QueryList):
    getAllOnboardingRequests = graphene.List(
        OnboardingRequest,
        number=graphene.Int(default_value=5),
        offset=graphene.Int(default_value=0),
        role=graphene.String(default_value=""),
        status=graphene.List(
            graphene.String,
            default_value=["Pending", "Approved", "Rejected"],
        ),
    )
    getOnboardingRequestById = graphene.Field(
        OnboardingRequest, id=graphene.String(required=True)
    )

    def resolve_getAllOnboardingRequests(self, info, number, offset, role, status):
        onboarding_request_dtos = services[
            "onboarding_request_service"
        ].get_all_onboarding_requests(
            number,
            offset,
            role,
            status,
        )
        return [
            OnboardingRequest(
                id=onboarding_request_dto.id,
                info=onboarding_request_dto.info,
                date_submitted=onboarding_request_dto.date_submitted,
                status=onboarding_request_dto.status,
            )
            for onboarding_request_dto in onboarding_request_dtos
        ]

    def resolve_getOnboardingRequestById(self, info, id):
        onboarding_request_dto = services[
            "onboarding_request_service"
        ].get_onboarding_request_by_id(id)
        return OnboardingRequest(
            id=onboarding_request_dto.id,
            info=onboarding_request_dto.info,
            date_submitted=onboarding_request_dto.date_submitted,
            status=onboarding_request_dto.status,
        )


# Mutations


class CreateOnboardingRequest(Mutation):
    class Arguments:
        userInfo = UserInfoInput(required=True)

    onboarding_request = graphene.Field(OnboardingRequest)

    def mutate(self, info, userInfo):
        try:
            onboarding_request_dto = services[
                "onboarding_request_service"
            ].create_onboarding_request(userInfo=userInfo)
            onboarding_request = OnboardingRequest(
                id=onboarding_request_dto.id,
                info=onboarding_request_dto.info,
                date_submitted=onboarding_request_dto.date_submitted,
                status=onboarding_request_dto.status,
            )

            return CreateOnboardingRequest(onboarding_request=onboarding_request)
        except NotUniqueError:
            raise GraphQLError(ONBOARDING_REQUEST_EMAIL_ALREADY_EXISTS_ERROR)


class ApproveOnboardingRequest(Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    onboarding_request = graphene.Field(OnboardingRequest)

    def mutate(self, info, id):
        onboarding_request_dto = services[
            "onboarding_request_service"
        ].approve_onboarding_request(id)
        onboarding_request = OnboardingRequest(
            id=onboarding_request_dto.id,
            info=onboarding_request_dto.info,
            date_submitted=onboarding_request_dto.date_submitted,
            status=onboarding_request_dto.status,
        )

        return ApproveOnboardingRequest(onboarding_request=onboarding_request)


class RejectOnboardingRequest(Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    onboarding_request = graphene.Field(OnboardingRequest)

    def mutate(self, info, id):
        onboarding_request_dto = services[
            "onboarding_request_service"
        ].reject_onboarding_request(id)
        onboarding_request = OnboardingRequest(
            id=onboarding_request_dto.id,
            info=onboarding_request_dto.info,
            date_submitted=onboarding_request_dto.date_submitted,
            status=onboarding_request_dto.status,
        )

        return RejectOnboardingRequest(onboarding_request=onboarding_request)


class OnboardingRequestMutations(MutationList):
    createOnboardingRequest = CreateOnboardingRequest.Field()
    approveOnboardingRequest = ApproveOnboardingRequest.Field()
    rejectOnboardingRequest = RejectOnboardingRequest.Field()
