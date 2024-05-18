from ..interfaces.email_service import IEmailService


from typing import List, TypedDict


class MockEmailType(TypedDict):
    from_: str
    to: str
    subject: str
    body: str


class MockEmailService(IEmailService):
    """
    MockEmailService for handling email related functionality
    """

    instance = None

    def __init__(self, logger, credentials, sender_email, display_name=None):
        self.logger = logger
        self.sender_email = sender_email
        assert credentials is not None
        if display_name:
            self.sender = "{name} <{email}>".format(
                name=display_name, email=sender_email
            )
        else:
            self.sender = sender_email
        self.emails_sent: List[MockEmailType] = []
        MockEmailService.instance = self

    def send_email(self, to, subject, body):
        message: MockEmailType = {
            "from_": self.sender,
            "to": to,
            "subject": subject,
            "body": body,
        }
        print(
            f"MockEmailService: Sent email to {message['to']} from {message['from_']} with subject '{message['subject']}'"
        )
        self.emails_sent.append(message)

    def get_last_email_sent(self):
        if not self.emails_sent:
            return None
        return self.emails_sent[-1]

    def get_all_emails_sent(self):
        return self.emails_sent

    def get_emails_sent_to(self, to):
        return [email for email in self.emails_sent if email["to"] == to]

    def get_emails_with_subject(self, subject):
        return [email for email in self.emails_sent if email["subject"] == subject]

    def clear_emails_sent(self):
        self.emails_sent = []
