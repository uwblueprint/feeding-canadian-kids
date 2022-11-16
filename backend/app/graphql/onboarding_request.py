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
        first=graphene.Int(default_value=5),
        offset=graphene.Int(default_value=0),
        role=graphene.String(default_value=""),
        status=graphene.String(default_value=""),
    )
    getOnboardingRequestById = graphene.List(
        GetOnboardingRequest,
        id=graphene.String(),
        first=graphene.Int(default_value=5),
        offset=graphene.Int(default_value=0),
    )

    def resolve_getAllOnboardingRequests(self, info, first, offset, role, status):
        requests = services["onboarding_request_service"].get_all_onboarding_requests()
        if role != "":
            filtered = []
            for request in requests:
                if request["info"]["role"] == role:
                    filtered.append(
                        GetOnboardingRequest(
                            contact_name=request["info"]["contact_name"],
                            contact_email=request["info"]["contact_email"],
                            contact_phone=request["info"]["contact_phone"],
                            role=request["info"]["role"],
                            date_submitted=request["date_submitted"],
                            status=request["status"],
                        )
                    )
            return filtered[offset : offset + first]

        if status != "":
            filtered = []
            for request in requests:
                if request["status"] == status:
                    filtered.append(
                        GetOnboardingRequest(
                            contact_name=request["info"]["contact_name"],
                            contact_email=request["info"]["contact_email"],
                            contact_phone=request["info"]["contact_phone"],
                            role=request["info"]["role"],
                            date_submitted=request["date_submitted"],
                            status=request["status"],
                        )
                    )
            return filtered[offset : offset + first]

        return [
            *map(
                lambda request: GetOnboardingRequest(
                    contact_name=request["info"]["contact_name"],
                    contact_email=request["info"]["contact_email"],
                    contact_phone=request["info"]["contact_phone"],
                    role=request["info"]["role"],
                    date_submitted=request["date_submitted"],
                    status=request["status"],
                ),
                requests[offset : offset + first],
            )
        ]

    def resolve_getOnboardingRequestById(self, info, id, offset, first):
        request = services["onboarding_request_service"].get_onboarding_request_by_id(
            id
        )
        return [
            *map(
                lambda request: GetOnboardingRequest(
                    contact_name=request["info"]["contact_name"],
                    contact_email=request["info"]["contact_email"],
                    contact_phone=request["info"]["contact_phone"],
                    role=request["info"]["role"],
                    date_submitted=request["date_submitted"],
                    status=request["status"],
                ),
                request[offset : offset + first],
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
