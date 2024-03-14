from app.graphql import schema as graphql_schema
from app.models.meal_request import MealRequest, MealStatus
from app.models.user_info import UserInfoRole
from app.services.implementations.mock_email_service import MockEmailService
from app.services.interfaces.reminder_email_service import IReminderEmailService
def test_regular_emails(reminder_email_setup, user_setup, meal_request_setup):
        _, _, meal_request = meal_request_setup
        asp, donor, admin = user_setup
        # etc.


        email_service: MockEmailService = MockEmailService.instance # type: ignore
        email_service.clear_emails_sent()

        # Do some setup (like take some users and have them commit to meal requests)

        reminder_email_service: IReminderEmailService = reminder_email_setup # type: ignore
        reminder_email_service.send_regularly_scheduled_emails()


        # Check that the correct emails were sent
        all_emails_sent = email_service.get_all_emails_sent()
        print('all email sent are', all_emails_sent)
        assert len(all_emails_sent) == 1
        email_sent = all_emails_sent[0]

        assert email_sent['to'] == 'test@test.com'
        assert email_sent['body'] == 'test'
        assert email_sent['subject'] == 'test'
        assert email_sent['from_'] == 'Feeding Canadian Kids <feedingcanadiankids@uwblueprint.org>'
