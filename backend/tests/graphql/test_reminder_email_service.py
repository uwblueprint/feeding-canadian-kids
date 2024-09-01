from app.graphql import schema as graphql_schema
from app.services.implementations.mock_email_service import MockEmailService
from app.services.interfaces.reminder_email_service import IReminderEmailService
from datetime import datetime, timedelta, timezone


def test_meal_yesterday(
    reminder_email_setup, user_setup, meal_request_setup, onsite_contact_setup
):
    _, _, meal_request = meal_request_setup
    (
        asp,
        donor,
        [asp_onsite_contact, asp_onsite_contact2],
        [donor_onsite_contact, donor_onsite_contact2],
    ) = onsite_contact_setup

    users = user_setup
    reminder_email_service: IReminderEmailService = reminder_email_setup  # type: ignore

    dropoff_time = (
        datetime.now(timezone.utc) - timedelta(days=1) - timedelta(minutes=20)
    )

    meal_request.drop_off_datetime = dropoff_time
    meal_request.onsite_contacts = [asp_onsite_contact.id, asp_onsite_contact2.id]

    meal_request.save()

    requestor_email, donor_email = get_emails_and_check_destinations(
        reminder_email_service, meal_request, users
    )

    assert "We hope you enjoyed your requested meal!" in requestor_email["body"]
    assert requestor_email["subject"] == "We hope you enjoyed your meal!"
    assert requestor_email["cc"] == [
        asp_onsite_contact.email,
        asp_onsite_contact2.email,
    ]

    assert "Your meal request was supplied yesterday." in donor_email["body"]
    assert donor_email["subject"] == "Thank you again for your meal donation!"


def test_meal_tomorrow(reminder_email_setup, user_setup, meal_request_setup):
    asp, _, meal_request = meal_request_setup
    users = user_setup
    reminder_email_service: IReminderEmailService = reminder_email_setup  # type: ignore

    dropoff_time = (
        datetime.now(timezone.utc) + timedelta(days=1) + timedelta(minutes=20)
    )
    meal_request.drop_off_datetime = dropoff_time
    meal_request.save()

    requestor_email, donor_email = get_emails_and_check_destinations(
        reminder_email_service, meal_request, users
    )

    assert "Your meal request is scheduled for tomorrow!" in requestor_email["body"]
    assert (
        f"Dropoff Location: {asp.info.organization_address}" in requestor_email["body"]
    )
    assert str(asp.info.organization_address) in requestor_email["body"]
    assert requestor_email["subject"] == "Your meal request is only one day away!"

    assert (
        "The meal request you are donating to is scheduled for tomorrow!"
        in donor_email["body"]
    )
    assert f"Dropoff Location: {asp.info.organization_address}" in donor_email["body"]
    assert str(asp.info.organization_address) in donor_email["body"]
    assert donor_email["subject"] == "Your meal donation is only one day away!"


def get_emails_and_check_destinations(reminder_email_service, meal_request, users):
    requestor = users[0]
    donor = users[1]
    meal_request.requestor = requestor
    commit_to_meal_request(donor, meal_request)

    email_service: MockEmailService = MockEmailService.instance  # type: ignore
    email_service.clear_emails_sent()

    reminder_email_service.send_regularly_scheduled_emails()

    # # Check that the correct emails were sent
    all_emails_sent = email_service.get_all_emails_sent()
    if all_emails_sent[0]["to"] == requestor.info.email:
        requestor_email = all_emails_sent[0]
        donor_email = all_emails_sent[1]
    else:
        requestor_email = all_emails_sent[1]
        donor_email = all_emails_sent[0]

    assert requestor_email["to"] == requestor.info.email
    assert donor_email["to"] == donor.info.email
    assert (
        requestor_email["from_"]
        == "Feeding Canadian Kids <feedingcanadiankids@uwblueprint.org>"
    )
    assert (
        donor_email["from_"]
        == "Feeding Canadian Kids <feedingcanadiankids@uwblueprint.org>"
    )

    return requestor_email, donor_email


def commit_to_meal_request(donor, meal_request):
    commit_to_meal_request_mutation = f"""
        mutation testCommitToMealRequest {{
        commitToMealRequest(
            requestor: "{str(donor.id)}",
            mealRequestIds: ["{str(meal_request.id)}"],
            mealDescription: "Pizza",
            additionalInfo: "No nuts"
            donorOnsiteContacts: []
        )
        {{
            mealRequests {{
            id
            requestor {{
                id
            }}
            status
            dropOffDatetime
            mealInfo {{
                portions
                dietaryRestrictions
            }}
            onsiteContacts {{
                name
                email
                phone
            }}
            dateCreated
            dateUpdated
            deliveryInstructions
            donationInfo {{
                donor {{
                id
                }}
                commitmentDate
                mealDescription
                additionalInfo
            }}
            }}
        }}
        }}
    """
    result = graphql_schema.execute(commit_to_meal_request_mutation)
    assert not result.errors
