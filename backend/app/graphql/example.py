import graphene


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
class Greeting(graphene.ObjectType):
    text = graphene.String(description="A typical hello world")
    more_text = graphene.String(description="More text")

    # Fields returned here will override any parents.
    def resolve_text(self, info):
        return "Hello, world!"


class ExampleQueries(graphene.ObjectType):
    greeting = graphene.Field(Greeting)

    def resolve_greeting(self, info):
        # Instead of a hard-coded dictionary, you should call into a service here.
        return {
            "text": "Greetings!",
            "more_text": "This is another greeting!",
        }


# Mutations
class PrintGreeting(graphene.Mutation):
    class Arguments:
        text = graphene.String()

    printed_text = graphene.String()

    def mutate(self, info, text):
        text_to_print = f"Greeting: {text}"

        import sys
        print(text_to_print, file=sys.stderr)

        return PrintGreeting(text_to_print)


class ExampleMutations(graphene.ObjectType):
    # You must use PrintGreeting.Field() rather than graphene.Field(PrintGreeting);
    # otherwise, arguments won't work as expected.
    printGreeting = PrintGreeting.Field()
