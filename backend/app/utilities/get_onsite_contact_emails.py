from typing import List
from app.models.meal_request import MealRequest


def get_meal_request_asp_onsite_contact_emails(meal_request: MealRequest) -> List[str]:
    out = []
    for contact in meal_request.onsite_contacts:
        # If a contact is deleted, it won't have the `to_serializable_dict` method, so we won't add it to the results
        if not hasattr(contact, "to_serializable_dict"):
            continue
        out.append(contact.email)
    return out


def get_meal_request_donor_onsite_contact_emails(
    meal_request: MealRequest,
) -> List[str]:
    out = []
    if meal_request.donation_info and meal_request.donation_info.donor_onsite_contacts:
        for contact in meal_request.donation_info.donor_onsite_contacts:
            # If a contact is deleted, it won't have the `to_serializable_dict` method, so we won't add it to the results
            if not hasattr(contact, "to_serializable_dict"):
                continue
            out.append(contact.email)
    return out
