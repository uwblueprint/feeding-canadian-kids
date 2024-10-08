import datetime


from .validate_utils import (
    validate_contact,
    validate_donation_info,
    validate_meal_info,
    validate_user,
)


class MealRequestDTO:
    def __init__(
        self,
        id,
        requestor,
        status,
        drop_off_datetime,
        meal_info,
        onsite_contacts,
        date_created,
        date_updated,
        delivery_instructions=None,
        donation_info=None,
    ):
        self.id = id
        self.requestor = requestor
        self.status = status
        self.drop_off_datetime = drop_off_datetime
        self.meal_info = meal_info
        self.onsite_contacts = onsite_contacts
        self.date_created = date_created
        self.date_updated = date_updated
        self.delivery_instructions = delivery_instructions
        self.donation_info = donation_info

        error_list = self.validate()
        if len(error_list) > 0:
            error_message = "\n".join(error_list)
            raise Exception(error_message)

    def validate(self):
        from ..models.meal_request import MEAL_STATUSES_STRINGS

        error_list = []

        if type(self.id) is not str:
            error_list.append("The id supplied is not a string.")

        validate_user(self.requestor, "requestor", error_list)

        if type(self.status) is not str:
            error_list.append(
                f"The status supplied was type {type(self.status)}, but expected a string."
            )

        if self.status not in MEAL_STATUSES_STRINGS:
            error_list.append(
                "The status {self_status} is not one of {valid_statuses}".format(
                    self_status=self.status,
                    valid_statuses=", ".join(MEAL_STATUSES_STRINGS),
                )
            )

        if type(self.drop_off_datetime) is not datetime.datetime:
            error_list.append(
                "The drop_off_datetime supplied is not a datetime object."
            )

        validate_meal_info(self.meal_info, error_list)

        for i, staff in enumerate(self.onsite_contacts):
            validate_contact(staff, f"index {i} of onsite_contacts", error_list)

        if type(self.date_created) is not datetime.datetime:
            error_list.append("The date_created supplied is not a datetime object.")

        if type(self.date_updated) is not datetime.datetime:
            error_list.append("The date_updated supplied is not a datetime object.")

        if self.delivery_instructions and type(self.delivery_instructions) is not str:
            error_list.append("The delivery_instructions supplied is not a string.")

        if self.donation_info:
            validate_donation_info(self.donation_info, error_list)

        return error_list
