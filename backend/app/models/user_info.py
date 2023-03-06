import mongoengine as mg


class UserInfo(mg.EmbeddedDocument):
    contact_name = mg.StringField(required=True)
    contact_email = mg.StringField(required=True)
    contact_phone = mg.StringField(required=True)
    email = mg.StringField(required=True)
    organization_address = mg.StringField(required=True)
    organization_name = mg.StringField(required=True)
    role = mg.StringField(choices=["Admin", "Donor", "ASP"], required=True)

    meta = {"allow_inheritance": True}


class ASPInfo(UserInfo):
    priority: mg.IntField(required=True)
    locations = mg.ListField(mg.PointField(required=True))
