from .validate_utils import validate_userinfo


class UserDTO:
    def __init__(self, id, info):
        self.id = id
        self.info = info

        error_list = self.validate()
        if len(error_list) > 0:
            error_message = "\n".join(error_list)
            self.logger.error(error_message)
            raise Exception(error_message)

    def validate(self):
        error_list = validate_userinfo(self.info, [])

        if type(self.id) is not str:
            error_list.append("The id supplied is not a string.")

        return error_list
