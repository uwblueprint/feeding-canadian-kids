import graphene

from ..graphql.services import services

from .types import Contact, Mutation, MutationList, Query, QueryList, UserInfo


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
class GetOnboardingRequest(Query):
    email = graphene.String()
    organization_address = graphene.String()
    organization_name = graphene.String()
    role = graphene.String()
    primary_contact = graphene.Field(Contact)
    onsite_contacts = graphene.List(Contact)
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
                email=request.email,
                organization_address=request.organization_address,
                organization_name=request.organization_name,
                role=request.role,
                primary_contact=request.primary_contact,
                onsite_contacts=request.onsite_contacts,
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


class ApproveOnboardingRequest(Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    onboardingRequest = graphene.Field(OnboardingRequest)

    def mutate(self, info, id):
        approvedOnboardingRequest = services[
            "onboarding_request_service"
        ].approve_onboarding_request(id)
        return ApproveOnboardingRequest(onboardingRequest=approvedOnboardingRequest)


class RejectOnboardingRequest(Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    onboardingRequest = graphene.Field(OnboardingRequest)

    def mutate(self, info, id):
        rejectedOnboardingRequest = services[
            "onboarding_request_service"
        ].reject_onboarding_request(id)
        return RejectOnboardingRequest(onboardingRequest=rejectedOnboardingRequest)


class OnboardingRequestMutations(MutationList):
    createOnboardingRequest = CreateOnboardingRequest.Field()
    approveOnboardingRequest = ApproveOnboardingRequest.Field()
    rejectOnboardingRequest = RejectOnboardingRequest.Field()
