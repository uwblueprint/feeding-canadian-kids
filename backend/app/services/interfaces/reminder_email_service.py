from abc import ABC, abstractmethod

from app.services.interfaces.email_service import IEmailService


class IReminderEmailService(ABC):
    def __init__(self, logger, email_service: IEmailService):
        pass

    def send_regularly_scheduled_emails(self):
        pass
