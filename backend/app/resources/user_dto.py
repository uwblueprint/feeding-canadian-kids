from ..graphql.middleware.validate import validate_userinfo


class UserDTO:
    def __init__(self, id, info):
        self.id = id
        self.info = info

    def validate(self):
        error_list = []
        if type(self.id) is not str:
            error_list.append("The id supplied is not a string.")

        error_list = validate_userinfo(self.info, error_list)

        return error_list
