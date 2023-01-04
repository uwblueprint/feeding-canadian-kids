import graphene

from ..graphql.services import services

from .types import (
    Mutation,
    MutationList,
)
from .shared import GeoLocationInput

# Object Types


class UserInfoInput(graphene.InputObjectType):
    contact_name = graphene.String(required=True)
    contact_email = graphene.String(required=True)
    contact_phone = graphene.String()
    role = graphene.String(required=True)
    location = graphene.Argument(GeoLocationInput)


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
