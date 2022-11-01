import re

emailRegex = r"^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$"
phoneRegex = r"^[0-9]{10}$"


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
        if type(self.contact_email) is not str:
            error_list.append("The contact email supplied is not a string.")
        if not re.search(emailRegex, self.contact_email):
            error_list.append("The contact email is not in the correct format.")
        if type(self.contact_phone) is not str:
            error_list.append("The contact phone supplied is not a string.")
        if not re.search(phoneRegex, self.contact_phone):
            error_list.append("The contact phone number is invalid.")
        if type(self.role) is not str:
            error_list.append("The role supplied is not a string.")
        if self.role not in ["ASP", "Donor", "Admin"]:
            error_list.append("The role is invalid.")
        return error_list
