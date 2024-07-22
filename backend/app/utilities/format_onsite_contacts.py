from typing import List, Union

from app.graphql.types import Contact, OnsiteContact
from app.models.meal_request import MealRequest
from app.services.implementations.email_service import EmailService

def get_onsite_contacts_string(onsite_contacts: List[Union[OnsiteContact, Contact]]):
        string = ""
        for contact in onsite_contacts:
                string += "<p>"
                string += f"{contact.name}<br />{contact.email}<br />{contact.phone}<br />"
                string += "</p>"

        return string

        
def get_meal_request_snippet(meal_request: MealRequest):
        meal_request_snippet = EmailService.read_email_template("email_templates/meal_request_snippet.html").format( 
                dropoff_location=meal_request.requestor.info.organization_address,
                dropoff_time=meal_request.drop_off_datetime,
                num_meals=meal_request.meal_info.portions,
                dietary_restrictions=meal_request.meal_info.dietary_restrictions,
                delivery_instructions=meal_request.delivery_instructions,
                asp_organization_name=meal_request.requestor.info.organization_name,
                asp_primary_contact=get_onsite_contacts_string([meal_request.requestor.info.primary_contact]),
                asp_onsite_contacts=get_onsite_contacts_string(meal_request.onsite_contacts),
                donor_organization_name=meal_request.donation_info.donor.info.organization_name,
                donor_primary_contact=get_onsite_contacts_string([meal_request.donation_info.donor.info.primary_contact]),
                donor_onsite_contacts=get_onsite_contacts_string(meal_request.donation_info.donor_onsite_contacts),
                meal_description=meal_request.donation_info.meal_description,
                additional_info=meal_request.donation_info.additional_info,
        )
        return meal_request_snippet