class OnboardingRequestDTO:
    def __init__(
        self,
        email,
        organization_address,
        organization_name,
        role,
        primary_contact,
        onsite_contacts,
        date_submitted,
        status,
    ):
        self.email = email
        self.organization_address = organization_address
        self.organization_name = organization_name
        self.role = role
        self.primary_contact = primary_contact
        self.onsite_contacts = onsite_contacts
        self.date_submitted = date_submitted
        self.status = status
