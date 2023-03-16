import mongoengine as mg


class Contact(mg.EmbeddedDocument):
    name = mg.StringField(required=True)
    email = mg.StringField(required=True)
    phone = mg.StringField(required=True)


class UserInfo(mg.EmbeddedDocument):
    email = mg.StringField(required=True)
    organization_address = mg.StringField(required=True)
    organization_name = mg.StringField(required=True)
    role = mg.StringField(choices=["Admin", "Donor", "ASP"], required=True)
    primary_contact = mg.EmbeddedDocumentField(Contact, required=True)
    onsite_contacts = mg.EmbeddedDocumentListField(Contact, required=True)

    meta = {"allow_inheritance": True}


class ASPInfo(UserInfo):
    priority: mg.IntField(required=True)
    locations = mg.ListField(mg.PointField(required=True))
