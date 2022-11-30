import mongoengine as mg


class UserInfo(mg.EmbeddedDocument):
    contact_name = mg.StringField(required=True)
    contact_email = mg.StringField(required=True)
    contact_phone = mg.StringField()
    role = mg.StringField(choices=["Admin", "Donor", "ASP"], required=True)
    user_uid = mg.StringField(required=False)
    meta = {"allow_inheritance": True}


class ASPInfo(UserInfo):
    priority: mg.IntField(required=True)
    locations = mg.ListField(mg.PointField(required=True))
