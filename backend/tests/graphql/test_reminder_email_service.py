from app.graphql import schema as graphql_schema
from app.services.implementations.mock_email_service import MockEmailService
from app.services.interfaces.reminder_email_service import IReminderEmailService
from datetime import datetime, timedelta


def test_meal_yesterday(reminder_email_setup, user_setup, meal_request_setup):
    _, _, meal_request = meal_request_setup
    users = user_setup
    dropoff_time = datetime.now() - timedelta(days=1) - timedelta(minutes=20)

    meal_request.drop_off_datetime = dropoff_time
    meal_request.save()

    requestor = users[0]
    donor = users[1]
    meal_request.requestor = requestor
    commit_to_meal_request(donor, meal_request)

    email_service: MockEmailService = MockEmailService.instance  # type: ignore
    email_service.clear_emails_sent()

    reminder_email_service: IReminderEmailService = reminder_email_setup  # type: ignore
    reminder_email_service.send_regularly_scheduled_emails()

    # # Check that the correct emails were sent
    all_emails_sent = email_service.get_all_emails_sent()
    print(all_emails_sent)
    requestor_email = all_emails_sent[0]
    donor_email = all_emails_sent[1]

    assert requestor_email["to"] == requestor.info.email
    assert "We hope you enjoyed your requested meal!" in requestor_email["body"]
    assert requestor_email["subject"] == "We hope you enjoyed your meal!"
    assert (
        requestor_email["from_"]
        == "Feeding Canadian Kids <feedingcanadiankids@uwblueprint.org>"
    )

    assert donor_email["to"] == donor.info.email
    assert "Your meal request was supplied yesterday." in donor_email["body"]
    assert donor_email["subject"] == "Thank you again for your meal donation!"
    assert (
        requestor_email["from_"]
        == "Feeding Canadian Kids <feedingcanadiankids@uwblueprint.org>"
    )


def test_meal_tomorrow(reminder_email_setup, user_setup, meal_request_setup):
    _, _, meal_request = meal_request_setup
    users = user_setup
    dropoff_time = datetime.now() + timedelta(days=1) + timedelta(minutes=20)

    meal_request.drop_off_datetime = dropoff_time
    meal_request.save()

    requestor = users[0]
    donor = users[1]
    meal_request.requestor = requestor
    commit_to_meal_request(donor, meal_request)

    email_service: MockEmailService = MockEmailService.instance  # type: ignore
    email_service.clear_emails_sent()

    reminder_email_service: IReminderEmailService = reminder_email_setup  # type: ignore
    reminder_email_service.send_regularly_scheduled_emails()

    # # Check that the correct emails were sent
    all_emails_sent = email_service.get_all_emails_sent()
    requestor_email = all_emails_sent[0]
    donor_email = all_emails_sent[1]

    assert requestor_email["to"] == requestor.info.email
    assert "Your meal request is scheduled for tomorrow!" in requestor_email["body"]
    assert (
        f"Dropoff Location: {meal_request.drop_off_location}" in requestor_email["body"]
    )
    assert str(meal_request.drop_off_location) in requestor_email["body"]
    assert requestor_email["subject"] == "Your meal request is only one day away!"
    assert (
        requestor_email["from_"]
        == "Feeding Canadian Kids <feedingcanadiankids@uwblueprint.org>"
    )

    assert donor_email["to"] == donor.info.email
    assert (
        "The meal request you donated is scheduled for tomorrow!" in donor_email["body"]
    )
    assert f"Dropoff Location: {meal_request.drop_off_location}" in donor_email["body"]
    assert str(meal_request.drop_off_location) in donor_email["body"]
    assert donor_email["subject"] == "Your meal donation is only one day away!"
    assert (
        requestor_email["from_"]
        == "Feeding Canadian Kids <feedingcanadiankids@uwblueprint.org>"
    )


def commit_to_meal_request(donor, meal_request):
    commit_to_meal_request_mutation = f"""
        mutation testCommitToMealRequest {{
        commitToMealRequest(
            requestor: "{str(donor.id)}",
            mealRequestIds: ["{str(meal_request.id)}"],
            mealDescription: "Pizza",
            additionalInfo: "No nuts"
        )
        {{
            mealRequests {{
            id
            requestor {{
                id
            }}
            status
            dropOffDatetime
            dropOffLocation
            mealInfo {{
                portions
                dietaryRestrictions
            }}
            onsiteStaff {{
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
