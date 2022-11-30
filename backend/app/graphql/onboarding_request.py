import graphene

from ..graphql.services import services

from .types import (
    Mutation,
    MutationList,
)

# Object Types
class UserInfoInput(graphene.InputObjectType):
    contact_name = graphene.String(required=True)
    contact_email = graphene.String(required=True)
    contact_phone = graphene.String()
    role = graphene.String(required=True)
    user_uid = graphene.String()


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

class OnboardingRequestInput(graphene.InputObjectType):
    id = graphene.ID()
    info = graphene.Field(UserInfoInput)
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

class ApproveOnboardingRequest(Mutation):
    class Arguments:
        id = graphene.ID(required=True)
    
    onboardingRequest = graphene.Field(OnboardingRequest)

    def mutate(self, info, id):
        approvedOnboardingRequest = services[
            "onboarding_request_service"
        ].approve_onboarding_request(id)
        return ApproveOnboardingRequest(onboardingRequest=approvedOnboardingRequest)


class OnboardingRequestMutations(MutationList):
    createOnboardingRequest = CreateOnboardingRequest.Field()
    approveOnboardingRequest = ApproveOnboardingRequest.Field()

