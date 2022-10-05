import graphene
from .error_handling import ClientError
from .types import (
    Query,
    QueryList,
    Mutation,
    MutationList,
)

# Mutations
class CreateOnboardingRequest(Mutation):
    # class Arguments:

    
    # def mutate(self):


# class PrintGreeting(Mutation):
#     class Arguments:
#         text = graphene.String()

#     printed_text = graphene.String()

#     def mutate(self, info, text):
#         text_to_print = f"Greeting: {text}"

#         print(text_to_print)

#         return PrintGreeting(printed_text=text_to_print)

    
    
class OnboardingRequestMutations(MutationList):

    





