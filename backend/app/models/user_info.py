import mongoengine as mg


class UserInfo(mg.EmbeddedDocument):
    contact_name = mg.StringField(required=True)
    contact_email = mg.StringField(required=True)
    contact_phone = mg.StringField()
    role = mg.StringField(choices=["Admin", "Donor", "ASP"], required=True)

    meta = {"allow_inheritance": True}


class ASPInfo(UserInfo):
    priority: mg.IntField(required=True, default=0)
    location = mg.PointField(required=True)

class DonorInfo(UserInfo):
    location = mg.PointField(required=True)

