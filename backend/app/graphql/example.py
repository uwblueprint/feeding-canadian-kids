import graphene

from .error_handling import ClientError
from .types import (
    Query,
    QueryList,
    Mutation,
    MutationList,
)


"""
Example query:
    {
        greeting {
            text
            moreText
        }
    }

Example response:
    {
        "data": {
            "greeting": {
                "text": "Hello, world!",
                "moreText": "This is another greeting!"
            }
        }
    }
"""


# Queries
class Greeting(Query):
    text = graphene.String(description="A typical hello world")
    more_text = graphene.String(description="More text")

    # Fields returned here will override any parents.
    def resolve_text(self, info):
        return "Hello, world!"


class ExampleQueries(QueryList):
    greeting = graphene.Field(Greeting)

    def resolve_greeting(self, info):
        # Instead of a hard-coded dictionary, you should call into a service here.
        return {
            "text": "Greetings!",
            "more_text": "This is another greeting!",
        }


# Mutations
class PrintGreeting(Mutation):
    class Arguments:
        text = graphene.String()

    printed_text = graphene.String()

    def mutate(self, info, text):
        text_to_print = f"Greeting: {text}"

        print(text_to_print)

        return PrintGreeting(printed_text=text_to_print)


class RaiseError(Mutation):
    _ = graphene.String()

    def mutate(self, info):
        # This error gets redacted on the client-side.
        raise ValueError("Something happened!")


class RaiseClientError(Mutation):
    _ = graphene.String()

    def mutate(self, info):
        # This error gets shown on the client-side.
        raise ClientError("Something happened!")


class ExampleMutations(MutationList):
    # You must use PrintGreeting.Field() rather than graphene.Field(PrintGreeting);
    # otherwise, arguments won't work as expected.
    printGreeting = PrintGreeting.Field()
    raiseError = RaiseError.Field()
    raiseClientError = RaiseClientError.Field()
