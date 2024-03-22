from app.services.interfaces.reminder_email_service import IReminderEmailService
from app.services.interfaces.email_service import IEmailService
from ...models.user import User
from ...models.meal_request import MealRequest
from datetime import datetime, timedelta
from app.services.implementations.email_service import EmailService


class ReminderEmailService(IReminderEmailService):
    def __init__(self, logger, email_service: IEmailService):
        self.logger = logger
        self.email_service = email_service

    def get_meal_requests_one_day_away(self):
        """
        Helper function to get meal requests that are one day away.
                Returns:
                        list of meal requests
        """
        try:
            tomorrow_time = datetime.now() + timedelta(days=1)
            meal_requests = MealRequest.objects(
                drop_off_datetime__gt=tomorrow_time,
                drop_off_datetime__lt=tomorrow_time + timedelta(hours=1),
            )
        except Exception as e:
            self.logger.error("Failed to get meal requests one day away")
            raise e

        return meal_requests

    def get_meal_requests_one_day_ago(self):
        """
        Helper function to get meal requests that are one day ago.
                Returns:
                        list of meal requests
        """
        try:
            yesterday_time = datetime.now() - timedelta(days=1)
            meal_requests = MealRequest.objects(
                drop_off_datetime__gt=yesterday_time,
                drop_off_datetime__lt=datetime.now() - timedelta(hours=1),
            )
        except Exception as e:
            self.logger.error("Failed to get meal requests one day ago")
            raise e

        return meal_requests

    def send_email(self, email, meal_request, template_file_path, subject_line):
        try:
            email_body = EmailService.read_email_template(template_file_path).format(
                dropoff_location=meal_request.drop_off_location,
                dropoff_time=meal_request.drop_off_datetime,
                num_meals=meal_request.meal_info.portions,
            )
            self.email_service.send_email(
                email, subject_line, email_body
            )
        except Exception as e:
            self.logger.error(
                f"Failed to send reminder email for meal request one meal away for user {meal_request.id if meal_request else ''} {email}"
            )
            raise e
        self.logger.info(
            f"Sent reminder email for meal request to {email}"
        )

    def send_time_delayed_emails(self, meal_requests, template_file_paths, subject_lines):
        """
        Helper function to send emails to donors and requestors.
        Args:
            meal_requests: list of meal requests
        """
        for meal_request in meal_requests:
            meal_requestor_email = meal_request.requestor.info.email
            self.send_email(
                meal_requestor_email, meal_request, template_file_paths["requestor"], subject_lines["requestor"]
            )
            if hasattr(meal_request, "donation_info"):
                donor_id = meal_request.donation_info.donor.id
                donor = User.objects.get(id=donor_id)[0]
                donor_email = donor.email
                self.send_email(donor_email, meal_request, template_file_paths["donor"], subject_lines["donor"])

    def send_regularly_scheduled_emails(self):
        self.send_time_delayed_emails(
            self.get_meal_requests_one_day_away(),
            {
                "donor": "email_templates/donor_one_day_to_meal.html",
                "requestor": "email_templates/requestor_one_day_to_meal.html",
            },
            {
                "donor": "Your meal donation is only one day away!",
                "requestor": "Your meal request is only one day away!",
            },
        )

        self.send_time_delayed_emails(
            self.get_meal_requests_one_day_ago(),
            {
                "donor": "email_templates/donor_one_day_to_meal.html",
                "requestor": "email_templates/requestor_one_day_to_meal.html",
            },
            {
                "donor": "Thank you again for your meal donation!",
                "requestor": "We hope you enjoyed your meal!",
            },
        )
