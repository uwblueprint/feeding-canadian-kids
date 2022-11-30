class OnboardingRequestDTO:
    def __init__(
        self, contact_name, contact_email, contact_phone, role, date_submitted, status
    ):
        self.contact_name = contact_name
        self.contact_email = contact_email
        self.contact_phone = contact_phone
        self.role = role
        self.date_submitted = date_submitted
        self.status = status
