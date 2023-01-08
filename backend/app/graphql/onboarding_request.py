import graphene

from ..graphql.services import services

from .types import Mutation, MutationList, Query, QueryList

# Object Types


class UserInfoInput(graphene.InputObjectType):
    contact_name = graphene.String(required=True)
    contact_email = graphene.String(required=True)
    contact_phone = graphene.String()
    role = graphene.String(required=True)


class UserInfo(graphene.ObjectType):
    contact_name = graphene.String()
    contact_email = graphene.String()
    contact_phone = graphene.String()
    role = graphene.String()


class OnboardingRequest(graphene.ObjectType):
    id = graphene.ID()
    info = graphene.Field(UserInfo)
    date_submitted = graphene.DateTime()
    status = graphene.String()


# Queries

# Return object for queries
class GetOnboardingRequest(Query):
    contact_name = graphene.String()
    contact_email = graphene.String()
    contact_phone = graphene.String()
    role = graphene.String()
    date_submitted = graphene.DateTime()
    status = graphene.String()


class OnboardingRequestQueries(QueryList):
    getAllOnboardingRequests = graphene.List(
        GetOnboardingRequest,
        number=graphene.Int(default_value=5),
        offset=graphene.Int(default_value=0),
        role=graphene.String(default_value=""),
        status=graphene.String(default_value=""),
    )
    getOnboardingRequestById = graphene.List(
        GetOnboardingRequest,
        id=graphene.String(),
    )

    def resolve_getAllOnboardingRequests(self, info, number, offset, role, status):
        requests = services["onboarding_request_service"].get_all_onboarding_requests(
            number,
            offset,
            role,
            status,
        )
        return requests

    def resolve_getOnboardingRequestById(self, info, id):
        request = services["onboarding_request_service"].get_onboarding_request_by_id(
            id
        )
        return [
            GetOnboardingRequest(
                contact_name=request.contact_name,
                contact_email=request.contact_email,
                contact_phone=request.contact_phone,
                role=request.role,
                date_submitted=request.date_submitted,
                status=request.status,
            )
        ]


# Mutations


class CreateOnboardingRequest(Mutation):
    class Arguments:
        userInfo = UserInfoInput(required=True)

    onboardingRequest = graphene.Field(OnboardingRequest)

    def mutate(self, info, userInfo):
        newOnboardingRequest = services[
            "onboarding_request_service"
        ].create_onboarding_request(userInfo=userInfo)
        return CreateOnboardingRequest(onboardingRequest=newOnboardingRequest)


class OnboardingRequestMutations(MutationList):
    createOnboardingRequest = CreateOnboardingRequest.Field()
