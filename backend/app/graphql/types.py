import graphene

from .error_handling import LogErrors


class Query(graphene.ObjectType, metaclass=LogErrors(graphene.ObjectType)):
    pass


class QueryList(graphene.ObjectType, metaclass=LogErrors(graphene.ObjectType)):
    pass


# graphene.Mutation runs validation logic immediately when the class is
# declared. That means it will also run the logic on the above parent class. To
# get around this, we declare the method initially, then delete it from the
# class definition once the validation logic has completed. This way, subclasses
# still get the validation logic.
class Mutation(graphene.Mutation, metaclass=LogErrors(graphene.Mutation)):
    def mutate(self):
        pass


delattr(Mutation, "mutate")


class MutationList(graphene.ObjectType, metaclass=LogErrors(graphene.ObjectType)):
    pass


class Contact(graphene.ObjectType):
    name = graphene.String()
    email = graphene.String()
    phone = graphene.String()


class UserInfo(graphene.ObjectType):
    email = graphene.String()
    organization_address = graphene.String()
    organization_name = graphene.String()
    role = graphene.String()
    primary_contact = graphene.Field(Contact)
    onsite_contacts = graphene.List(Contact)


class User(graphene.ObjectType):
    id = graphene.String()
    info = graphene.Field(UserInfo)
