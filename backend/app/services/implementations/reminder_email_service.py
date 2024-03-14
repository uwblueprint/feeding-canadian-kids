
from app.services.interfaces.reminder_email_service import IReminderEmailService
from app.services.interfaces.email_service import IEmailService


class ReminderEmailService(IReminderEmailService):
    def __init__(self, logger, email_service: IEmailService):
        self.logger = logger
        self.email_service = email_service

    def send_regularly_scheduled_emails(self):
        # You should add a whole bunch of different helpers that are called from here which actually check the database and from there decide on what emails to send etc.
        self.email_service.send_email("test@test.com", "test", "test")