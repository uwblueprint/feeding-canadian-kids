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
class Mutation(
    graphene.Mutation, metaclass=LogErrors(graphene.Mutation)
):  # type: ignore
    def mutate(self):
        pass


delattr(Mutation, "mutate")


class MutationList(graphene.ObjectType, metaclass=LogErrors(graphene.ObjectType)):
    pass


class Contact(graphene.ObjectType):
    name = graphene.String()
    email = graphene.String()
    phone = graphene.String()


class ASPInfo(graphene.ObjectType):
    num_kids = graphene.Int()


class DonorInfo(graphene.ObjectType):
    type = graphene.String()
    tags = graphene.List(graphene.String)


class RoleInfo(graphene.ObjectType):
    asp_info = graphene.Field(ASPInfo)
    donor_info = graphene.Field(DonorInfo)


class UserInfo(graphene.ObjectType):
    email = graphene.String()
    organization_address = graphene.String()
    organization_name = graphene.String()
    organization_desc = graphene.String()
    organization_coordinates = graphene.List(graphene.Float)
    role = graphene.String()
    role_info = graphene.Field(RoleInfo)
    primary_contact = graphene.Field(Contact)
    initial_onsite_contacts = graphene.List(Contact)
    active = graphene.Boolean()
    involved_meal_requests = graphene.Int()


class ContactInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    email = graphene.String(required=True)
    phone = graphene.String(required=True)


class ASPInfoInput(graphene.InputObjectType):
    num_kids = graphene.Int()


class DonorInfoInput(graphene.InputObjectType):
    type = graphene.String()
    tags = graphene.List(graphene.String)


class RoleInfoInput(graphene.InputObjectType):
    asp_info = graphene.Field(ASPInfoInput)
    donor_info = graphene.Field(DonorInfoInput)


class UserInfoInput(graphene.InputObjectType):
    email = graphene.String(required=True)
    organization_address = graphene.String(required=True)
    organization_name = graphene.String(required=True)
    organization_desc = graphene.String(required=True)
    role = graphene.String(required=True)
    role_info = graphene.Field(RoleInfoInput)
    primary_contact = graphene.Field(ContactInput, required=True)
    initial_onsite_contacts = graphene.List(ContactInput, required=True)
    active = graphene.Boolean()


class User(graphene.ObjectType):
    id = graphene.String()
    info = graphene.Field(UserInfo)


class OnsiteContact(graphene.ObjectType):
    id = graphene.ID()
    organization_id = graphene.String()
    name = graphene.String()
    email = graphene.String()
    phone = graphene.String()


class ASPDistance(graphene.ObjectType):
    id = graphene.String()
    info = graphene.Field(UserInfo)
    distance = graphene.Float()


class SortDirection(graphene.Enum):
    ASCENDING = "ASC"
    DESCENDING = "DESC"
