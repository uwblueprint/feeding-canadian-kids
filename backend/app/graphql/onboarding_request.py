import graphene

from ..graphql.services import services

from .types import Mutation, MutationList, QueryList, UserInfo


# Object Types
class ContactInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    email = graphene.String(required=True)
    phone = graphene.String(required=True)


class UserInfoInput(graphene.InputObjectType):
    email = graphene.String(required=True)
    organization_address = graphene.String(required=True)
    organization_name = graphene.String(required=True)
    role = graphene.String(required=True)
    primary_contact = graphene.Field(ContactInput, required=True)
    onsite_contacts = graphene.List(ContactInput, required=True)


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
        status=graphene.String(default_value=""),
    )
    getOnboardingRequestById = graphene.Field(
        OnboardingRequest, id=graphene.String(required=True)
    )

    def resolve_getAllOnboardingRequests(self, info, number, offset, role, status):
        requests = services["onboarding_request_service"].get_all_onboarding_requests(
            number,
            offset,
            role,
            status,
        )
        return [
            OnboardingRequest(
                id=request.id,
                info=request.info,
                date_submitted=request.date_submitted,
                status=request.status,
            )
            for request in requests
        ]

    def resolve_getOnboardingRequestById(self, info, id):
        request = services["onboarding_request_service"].get_onboarding_request_by_id(
            id
        )
        return OnboardingRequest(
            id=request.id,
            info=request.info,
            date_submitted=request.date_submitted,
            status=request.status,
        )


# Mutations


class CreateOnboardingRequest(Mutation):
    class Arguments:
        userInfo = UserInfoInput(required=True)

    onboarding_request = graphene.Field(OnboardingRequest)

    def mutate(self, info, userInfo):
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
