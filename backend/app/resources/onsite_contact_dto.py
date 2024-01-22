class OnsiteContactDTO:
    def __init__(
        self,
        id: str,
        organization_id: str,
        name: str,
        email: str,
        phone: str
    ):
        self.id = id
        self.organization_id = organization_id
        self.name = name
        self.email = email
        self.phone = phone

        error_list = self.validate()
        if len(error_list) > 0:
            error_message = "\n".join(error_list)
            raise Exception(error_message)

    def validate(self):
        error_list = []

        if type(self.id) is not str:
            error_list.append("The id supplied is not a string.")

        print("type is", type(self.organization_id))




        for field in [self.name, self.email, self.phone, self.organization_id]:
            if type(field) is not str:
                error_list.append(f'The field "{field}" in onsite_contact {self.id} is not a string.')
            elif field == "":
                error_list.append(
                    f'The field "{field}" in onsite_contact {self.id} must not be an empty string.'
                )
        return error_list
