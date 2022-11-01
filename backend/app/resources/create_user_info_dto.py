import re

emailRegex = r"^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$"
phoneRegex = r"^[0-9]{9}$"


class CreateUserInfoDTO:
    def __init__(self, **kwargs):
        self.contact_name = kwargs.get("contact_name")
        self.contact_email = kwargs.get("contact_email")
        self.contact_phone = kwargs.get("contact_phone")
        self.role = kwargs.get("role")

    def validate(self):
        error_list = []
        if type(self.contact_name) is not str:
            error_list.append("The contact name supplied is not a string.")
        if type(self.contact_email) is not str or not re.search(
            emailRegex, self.contact_email
        ):
            error_list.append("The contact email supplied is not a string.")
        if type(self.contact_phone) is not str or not re.search(
            phoneRegex, self.contact_phone
        ):
            error_list.append("The contact phone supplied is not a string.")
        if type(self.role) is not str or self.role not in ["ASP", "Donor", "Admin"]:
            error_list.append("The role supplied is not a string.")
        return error_list
