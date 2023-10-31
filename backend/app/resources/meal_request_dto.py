import datetime

from ..models.meal_request import MEAL_STATUSES
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
        description,
        status,
        drop_off_datetime,
        drop_off_location,
        meal_info,
        onsite_staff,
        date_created,
        date_updated,
        delivery_instructions=None,
        donation_info=None,
    ):
        self.id = id
        self.requestor = requestor
        self.description = description
        self.status = status
        self.drop_off_datetime = drop_off_datetime
        self.drop_off_location = drop_off_location
        self.meal_info = meal_info
        self.onsite_staff = onsite_staff
        self.date_created = date_created
        self.date_updated = date_updated
        self.delivery_instructions = delivery_instructions
        self.donation_info = donation_info

        error_list = self.validate()
        if len(error_list) > 0:
            error_message = "\n".join(error_list)
            raise Exception(error_message)

    def validate(self):
        error_list = []

        if type(self.id) is not str:
            error_list.append("The id supplied is not a string.")

        validate_user(self.requestor, "requestor", error_list)

        if type(self.description) is not str:
            error_list.append("The description supplied is not a string.")

        if type(self.status) is not str:
            error_list.append("The status supplied is not a string.")

        if self.status not in MEAL_STATUSES:
            error_list.append(
                "The status {self_status} is not one of {valid_statuses}".format(
                    self_status=self.status, valid_statuses=", ".join(MEAL_STATUSES)
                )
            )

        if type(self.drop_off_datetime) is not datetime.datetime:
            error_list.append(
                "The drop_off_datetime supplied is not a datetime object."
            )

        if type(self.drop_off_location) is not str:
            error_list.append("The drop_off_location supplied is not a string.")

        validate_meal_info(self.meal_info, error_list)

        for i, staff in enumerate(self.onsite_staff):
            validate_contact(staff, f"index {i} of onsite_staff", error_list)

        if type(self.date_created) is not datetime.datetime:
            error_list.append("The date_created supplied is not a datetime object.")

        if type(self.date_updated) is not datetime.datetime:
            error_list.append("The date_updated supplied is not a datetime object.")

        if self.delivery_instructions and type(self.delivery_instructions) is not str:
            error_list.append("The delivery_instructions supplied is not a string.")

        if self.donation_info:
            validate_donation_info(self.donation_info, error_list)

        return error_list
