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

    def meal_request_one_day_away(self):
        try:
            res = []
            tomorrow_time = datetime.now() + timedelta(days=1)
            meal_requests = MealRequest.objects(
                drop_off_datetime__ge=tomorrow_time,
                drop_off_datetime__le=tomorrow_time + timedelta(hours=1),
            )
            for meal_request in meal_requests:
                meal_requestor_email = meal_request.requestor.email
                donor_id = meal_request.donation_info.donor.id
                donor = User.objects.get(id=donor_id)[0]
                donor_email = donor.email
                self.send_donor_email(donor_email, meal_request)
                self.send_requestor_email(meal_requestor_email, meal_request)
        except Exception as e:
            self.logger.error(
                f"Failed to send reminder email for meal request one meal away for user {meal_request.id if meal_request else ''} {meal_requestor_email}"
            )
            raise e

    def meal_request_yesterday(self):
        try:
            res = []
            yesterday_time = datetime.now() - timedelta(days=1)
            meal_requests = MealRequest.objects(
                drop_off_datetime__ge=yesterday_time - timedelta(hours=1),
                drop_off_datetime__lt=datetime.now(),
            )
            for meal_request in meal_requests:
                meal_requestor_email = meal_request.requestor.email
                donor_id = meal_request.donation_info.donor.id
                donor = User.objects.get(id=donor_id)[0]
                donor_email = donor.email
                res.append({"donor_email": donor_email, "meal_info": meal_request})
        except Exception as e:
            self.logger.error(
                f"Failed to send reminder email for meal request one meal away for user {meal_request.id if meal_request else ''} {meal_requestor_email}"
            )
            raise e

    def send_requestor_email(self, email, meal_request):
        try:
            email_body = EmailService.read_email_template(
                "email_templates/requestor_one_day_to_meal.html"
            ).format(
                dropoff_location=meal_request.drop_off_location,
                dropoff_time=meal_request.drop_off_datetime,
                num_meals=meal_request.meal_info.portions,
            )
            self.email_service.send_email(
                email, "Your meal request is only one day away!", email_body
            )
        except Exception as e:
            self.logger.error(
                f"Failed to send reminder email for meal request one meal away for user {meal_request.id if meal_request else ''} {email}"
            )
            raise e

    def send_donor_email(self, email, meal_request):
        try:
            email_body = EmailService.read_email_template(
                "email_templates/donor_one_day_to_meal.html"
            ).format(
                dropoff_location=meal_request.drop_off_location,
                dropoff_time=meal_request.drop_off_datetime,
                num_meals=meal_request.meal_info.portions,
            )
            self.email_service.send_email(
                email, "Your donated meal request is one day away!", email_body
            )
        except Exception as e:
            self.logger.error(
                f"Failed to send donor reminder email for meal request one meal away for user {meal_request.id if meal_request else ''} {email}"
            )
            raise e

    def get_email_info(self, meal_request, function):
        res = []
        for meal_request in self.meal_request_one_day_away():
            meal_requestor_email = meal_request.requestor.email
            donor_id = meal_request.donation_info.donor.id
            donor = User.objects.get(id=donor_id)[0]
            donor_email = donor.email
            res.append(
                {
                    "meal_requestor_email": meal_requestor_email,
                    "donor_email": donor_email,
                    "meal_info": meal_request,
                }
            )
        return res

    def send_regularly_scheduled_emails(self):
        # You should add a whole bunch of different helpers that are called from here which actually check the database and from there decide on what emails to send etc.
        meal_one_day_away = self.meal_request_one_day_away()
        for info in meal_one_day_away:
            requestor_email = info.get("meal_requestor_email")
            donor_email = info.get("donor_email")
            meal_info = info.get("meal_info")
            self.email_service.send_email(requestor_email, meal_info)
            self.email_service.send_email(donor_email, meal_info)

        meal_yesterday = self.meal_request_yesterday()
