class Token:
    def __init__(self, access_token, refresh_token):
        self.access_token = access_token
        self.refresh_token = refresh_token

        error_list = self.validate()
        if len(error_list) > 0:
            error_message = "\n".join(error_list)
            self.logger.error(error_message)
            raise Exception(error_message)

    def validate(self):
        error_list = []

        if type(self.access_token) is not str:
            error_list.append("The access_token supplied is not a string.")

        if type(self.refresh_token) is not str:
            error_list.append("The refresh_token supplied is not a string.")

        return error_list
