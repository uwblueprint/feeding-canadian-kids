from .validate_utils import validate_userinfo


class UpdateUserDTO:
    def __init__(self, auth_id, info):
        self.auth_id = auth_id
        self.info = info

    def validate(self):
        error_list = validate_userinfo(self.info, [])

        if type(self.auth_id) is not str:
            error_list.append("The auth_id supplied is not a string.")

        return error_list
