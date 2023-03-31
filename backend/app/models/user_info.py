import mongoengine as mg


USERINFO_ROLE_ADMIN = "Admin"
USERINFO_ROLE_DONOR = "Donor"
USERINFO_ROLE_ASP = "ASP"
USERINFO_ROLES = [USERINFO_ROLE_ADMIN, USERINFO_ROLE_DONOR, USERINFO_ROLE_ASP]


class Contact(mg.EmbeddedDocument):
    name = mg.StringField(required=True)
    email = mg.StringField(required=True)
    phone = mg.StringField(required=True)


class UserInfo(mg.EmbeddedDocument):
    email = mg.StringField(required=True)
    organization_address = mg.StringField(required=True)
    organization_name = mg.StringField(required=True)
    role = mg.StringField(choices=USERINFO_ROLES, required=True)
    primary_contact = mg.EmbeddedDocumentField(Contact, required=True)
    onsite_contacts = mg.EmbeddedDocumentListField(Contact, required=True)

    meta = {"allow_inheritance": True}


class ASPInfo(UserInfo):
    priority: mg.IntField(required=True)
    locations = mg.ListField(mg.PointField(required=True))
