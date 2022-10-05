class CreateUserInfoDTO:
    def __init__(self, **kwargs):
        self.contact_name= kwargs.get("contact_name")
        self.contact_email = kwargs.get("contact_email")
        self.contact_phone = kwargs.get("contact_phone")
        self.role = kwargs.get("role")

    def validate(self):
        error_list = []
        if type(self.contact_name) is not str:
            error_list.append("The contact name supplied is not a string.")
        if type(self.contact_email) is not str:
            error_list.append("The contact email supplied is not a string.")
        if type(self.contact_phone) is not str:
            error_list.append("The contact phone supplied is not a string.")
        if type(self.role) is not str:
            error_list.append("The role supplied is not a string.")
        return error_list
