import graphene

from ..services.implementations.onboarding_request_service import OnboardingRequestService

from .error_handling import ClientError
from .types import (
    Query,
    QueryList,
    Mutation,
    MutationList,
)

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
    info = graphene.Field(UserInfo)
    date_submitted = graphene.DateTime()
    status = graphene.String()

# Mutations
class CreateOnboardingRequest(Mutation):
    class Arguments:
        userInfo = UserInfoInput()
    onboardingRequest = graphene.Field(lambda: OnboardingRequest)
    
    def mutate(self, userInfo):
        newOnboardingRequest = OnboardingRequestService.create_onboarding_request(userInfo=userInfo)
        return CreateOnboardingRequest(onboardingRequest=newOnboardingRequest)

    
class OnboardingRequestMutations(MutationList):
    createOnboardingRequest = CreateOnboardingRequest.Field()

    





