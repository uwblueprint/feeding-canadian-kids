from enum import Enum
import mongoengine as mg


class UserInfoRole(Enum):
    ADMIN = "Admin"
    DONOR = "Donor"
    ASP = "ASP"


USERINFO_ROLES = [role.value for role in UserInfoRole]

DONOR_TYPE_RESTAURANT = "Restaurant"
DONOR_TYPE_INDIVIDUAL = "Individual"
DONOR_TYPES = [DONOR_TYPE_RESTAURANT, DONOR_TYPE_INDIVIDUAL]


class ASPInfo(mg.EmbeddedDocument):
    num_kids = mg.IntField(required=True)


class DonorInfo(mg.EmbeddedDocument):
    type = mg.StringField(choices=DONOR_TYPES)
    tags = mg.ListField(mg.StringField())


class RoleInfo(mg.EmbeddedDocument):
    asp_info = mg.EmbeddedDocumentField(ASPInfo)
    donor_info = mg.EmbeddedDocumentField(DonorInfo)


class Contact(mg.EmbeddedDocument):
    name = mg.StringField(required=True)
    email = mg.StringField(required=True)
    phone = mg.StringField(required=True)


class UserInfo(mg.EmbeddedDocument):
    email = mg.StringField(required=True, unique=True)
    organization_address = mg.StringField(required=True)
    organization_name = mg.StringField(required=True)
    organization_desc = mg.StringField(required=True)
    organization_coordinates = mg.GeoPointField()
    role = mg.StringField(choices=USERINFO_ROLES, required=True)
    role_info = mg.EmbeddedDocumentField(RoleInfo)
    primary_contact = mg.EmbeddedDocumentField(Contact, required=True)

    # This information is given as part of the onboarding request
    # When a user actually signs up, these contacts get turned into separate OnsiteContact documents
    initial_onsite_contacts = mg.EmbeddedDocumentListField(Contact, required=False)

    active = mg.BooleanField(default=True)

    meta = {"allow_inheritance": True}
