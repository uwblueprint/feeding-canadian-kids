class CreateUserDTO:
    def __init__(self, **kwargs):
        self.email = kwargs.get("email")
        self.password = kwargs.get("password")
        self.request_id = kwargs.get("request_id")

        error_list = self.validate()
        if len(error_list) > 0:
            error_message = "\n".join(error_list)
            raise Exception(error_message)

    def validate(self):
        error_list = []
        if type(self.email) is not str:
            error_list.append("The email supplied is not a string.")
        if type(self.password) is not str:
            error_list.append("The password supplied is not a string.")
        if type(self.request_id) is not str:
            error_list.append("The request_id supplied is not a string.")
        return error_list
