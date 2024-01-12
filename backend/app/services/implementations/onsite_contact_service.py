from typing import List

from app.models.onsite_contact import OnsiteContact
from app.resources.onsite_contact_dto import OnsiteContactDTO

from ...models.user_info import Contact
from ...models.meal_request import MealInfo, MealRequest
from ..interfaces.meal_request_service import IMealRequestService
from ..interfaces.onsite_contact_service import IOnsiteContactService
from datetime import datetime

from ...models.meal_request import DonationInfo, MealStatus
from ...models.user import User
from ...models.user_info import UserInfoRole
from ...graphql.types import SortDirection
from ...resources.meal_request_dto import MealRequestDTO


class OnsiteContactService(IOnsiteContactService):
    def __init__(self, logger):
        self.logger = logger

    def delete_onsite_contact_by_id(self, requestor_id: str, id: str):
        return super().delete_onsite_contact_by_id(requestor_id, id)

    def get_onsite_staff_by_id(self, requestor_id: str, id: str):
        return super().get_onsite_staff_by_id(requestor_id, id)

    def get_onsite_staff_for_user_by_id(self, requestor_id: str, id: str):
        return super().get_onsite_staff_for_user_by_id(requestor_id, id)

    def update_onsite_contact_by_id(self, requestor_id: str, id: str, name: str, email: str, phone: str):
        return super().update_onsite_contact_by_id(requestor_id, id, name, email, phone)

    def create_onsite_contact(self, organization_id: str, name: str, email: str, phone: str) -> OnsiteContactDTO:
        try:
            # Check that the organization does exist
            organization = User.objects(id=organization_id).first()
            if not organization:
                raise Exception(f'organization with id "{organization_id}" not found')

            new_contact = OnsiteContact(
                organization_id=organization_id,
                name=name,
                email=email,
                phone=phone,
            )
            new_contact.save()

            return OnsiteContactDTO(**new_contact.to_serializable_dict()) # type: ignore

        except Exception as error:
            self.logger.error(str(error))
            raise error

    # def update_meal_request(
    #     self,
    #     requestor_id,
    #     meal_info,
    #     drop_off_datetime,
    #     drop_off_location,
    #     delivery_instructions,
    #     onsite_staff,
    #     meal_request_id,
    # ):
    #     original_meal_request: MealRequest = MealRequest.objects(
    #         id=meal_request_id,
    #         requestor=requestor_id
    #     ).first()

    #     if not original_meal_request:
    #         raise Exception(f"meal request with id {meal_request_id} by {requestor_id} not found")

    #     if drop_off_datetime is not None:
    #         original_meal_request.drop_off_datetime = drop_off_datetime

    #     if meal_info is not None:
    #         original_meal_request.meal_info = MealInfo(
    #             portions=meal_info.portions,
    #             dietary_restrictions=meal_info.dietary_restrictions,
    #         )

    #     if drop_off_location is not None:
    #         original_meal_request.drop_off_location = drop_off_location

    #     if delivery_instructions is not None:
    #         original_meal_request.delivery_instructions = delivery_instructions

    #     if onsite_staff is not None:
    #         original_meal_request.onsite_staff = [
    #             Contact(name=staff.name, phone=staff.phone, email=staff.email)
    #             for staff in onsite_staff
    #         ]

    #     requestor = original_meal_request.requestor
    #     # Does validation,
    #     meal_request_dto = self.convert_meal_request_to_dto(
    #         original_meal_request, requestor
    #     )

    #     original_meal_request.save()
    #     return meal_request_dto

    # def commit_to_meal_request(
    #     self,
    #     donor_id: str,
    #     meal_request_ids: [str],
    #     meal_description: str,
    #     additional_info: str,
    # ) -> List[MealRequestDTO]:
    #     try:
    #         donor = User.objects(id=donor_id).first()
    #         if not donor:
    #             raise Exception(f'user "{donor_id}" not found')
    #         # The user committing to the meal request must have the "Donor" role
    #         if donor.info.role != UserInfoRole.DONOR.value:
    #             raise Exception(f'user "{donor_id}" is not a donor')

    #         if len(meal_request_ids) == 0:
    #             raise Exception("no meal requests to commit to")

    #         meal_request_dtos = []
    #         for meal_request_id in meal_request_ids:
    #             meal_request = MealRequest.objects(id=meal_request_id).first()
    #             if not meal_request:
    #                 raise Exception(f'meal request "{meal_request_id}" not found')
    #             # The meal request must be in the "Open" status
    #             if meal_request.status != MealStatus.OPEN.value:
    #                 raise Exception(
    #                     f'meal request "{meal_request_id}" is not open for commitment'
    #                 )

    #             meal_request.donation_info = DonationInfo(
    #                 donor=donor,
    #                 commitment_date=datetime.utcnow(),
    #                 meal_description=meal_description,
    #                 additional_info=additional_info,
    #             )

    #             # Change the meal request's status to "Upcoming"
    #             meal_request.status = MealStatus.UPCOMING.value

    #             meal_request_dtos.append(
    #                 self.convert_meal_request_to_dto(
    #                     meal_request, meal_request.requestor
    #                 )
    #             )

    #             meal_request.save()

    #         return meal_request_dtos

    #     except Exception as error:
    #         self.logger.error(str(error))
    #         raise error

    # def convert_meal_request_to_dto(
    #     self, request: MealRequest, requestor: User
    # ) -> MealRequestDTO:
    #     request_dict = request.to_serializable_dict()
    #     request_dict["requestor"] = requestor.to_serializable_dict()

    #     if "donation_info" in request_dict:
    #         donor_id = request_dict["donation_info"]["donor"]
    #         donor = User.objects(id=donor_id).first()
    #         if not donor:
    #             raise Exception(f'donor "{donor_id}" not found')
    #         request_dict["donation_info"]["donor"] = donor.to_serializable_dict()

    #     return MealRequestDTO(**request_dict)

    # def get_meal_requests_by_requestor_id(
    #     self,
    #     requestor_id,
    #     min_drop_off_date,
    #     max_drop_off_date,
    #     status : List[MealStatus],
    #     offset,
    #     limit,
    #     sort_by_date_direction,
    # ):
    #     print(status)
    #     status_value_list = list(map(lambda l: l.value, status))
    #     print("Trying to get statuses", status_value_list)
    #     try:
    #         sort_prefix = "+"
    #         if sort_by_date_direction == SortDirection.DESCENDING:
    #             sort_prefix = "-"

    #         requestor = User.objects(id=requestor_id).first()
    #         requests = MealRequest.objects(
    #             requestor=requestor,
    #             status__in=status_value_list,
    #         ).order_by(f"{sort_prefix}drop_off_datetime")

    #         # Filter results by optional parameters.
    #         # Since we want to filter these optionally (i.e. filter only if specified),
    #         # we cannot include them in the query above.
    #         if min_drop_off_date is not None:
    #             requests = requests.filter(
    #                 drop_off_datetime__gte=min_drop_off_date,
    #             )
    #         if max_drop_off_date is not None:
    #             requests = requests.filter(
    #                 drop_off_datetime__lte=max_drop_off_date,
    #             )
    #         if limit is not None:
    #             requests = requests[offset : offset + limit]
    #         else:
    #             requests = requests[offset:]

    #         meal_request_dtos = []
    #         for request in requests:
    #             meal_request_dtos.append(
    #                 self.convert_meal_request_to_dto(request, requestor)
    #             )

    #         return meal_request_dtos

    #     except Exception as error:
    #         self.logger.error(str(error))
    #         raise error

    # def get_meal_request_by_id(self, id: str) -> MealRequestDTO:
    #     meal_request = MealRequest.objects(id=id).first()
    #     meal_request_dto = self.convert_meal_request_to_dto(meal_request, meal_request.requestor)

    #     return meal_request_dto
