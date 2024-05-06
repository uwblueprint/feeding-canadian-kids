# NOTE: The coodinates have been mocked out in testing
MOCK_INFO1_SNAKE = {
    "email": "test1@organization.com",
    "organization_address": "255 King St N",
    "organization_name": "Test1 Org",
    "organization_desc": "Testing123",
    "organization_coordinates": [-11.1, 11.1],
    # Real Coordinates:
    # "organization_coordinates": [-80.52565465, 43.477876300000005],
    "role": "ASP",
    "role_info": {
        "asp_info": {
            "num_kids": 4,
        },
        "donor_info": None,
    },
    "primary_contact": {
        "name": "Jessie",
        "phone": "123456",
        "email": "jessie123@gmail.com",
    },
    "initial_onsite_contacts": [],
    "active": True,
}

MOCK_ONSITE_CONTACT_1 = {
    "name": "abc",
    "phone": "123-456-7890",
    "email": "abc@uwblueprint.org",
}
MOCK_ONSITE_CONTACT_2 = {
    "name": "Jane Doe",
    "phone": "111-222-3333",
    "email": "example@domain.com",
}

MOCK_INFO1_CAMEL = {
    "email": "test1@organization.com",
    "organizationAddress": "255 King St N",
    "organizationName": "Test1 Org",
    "organizationDesc": "Testing123",
    "organizationCoordinates": [-11.1, 11.1],
    # Real Coordinates:
    # "organizationCoordinates": [-80.52565465, 43.477876300000005],
    "role": "ASP",
    "roleInfo": {
        "aspInfo": {
            "numKids": 4,
        },
        "donorInfo": None,
    },
    "primaryContact": {
        "name": "Jessie",
        "phone": "123456",
        "email": "jessie123@gmail.com",
    },
    "initialOnsiteContacts": [],
    "active": True,
}

MOCK_INFO2_SNAKE = {
    "email": "test2@organization.com",
    "organization_address": "370 Highland Rd W",
    "organization_name": "Test2 Org",
    "organization_desc": "Testing123",
    "organization_coordinates": [-11.1, 11.1],
    # Real Coordinates:
    # "organization_coordinates": [-80.5118701, 43.4384664],
    "role": "Donor",
    "role_info": {
        "asp_info": None,
        "donor_info": {
            "type": "Restaurant",
            "tags": ["Halal", "Vegan"],
        },
    },
    "primary_contact": {
        "name": "Mr. Goose",
        "phone": "98765",
        "email": "goose@gmail.com",
    },
    "initial_onsite_contacts": [],
    # "initial_onsite_contacts": [
    #     {"name": "def", "phone": "098-765-4321", "email": "def@uwblueprint.org"},
    #     {"name": "John Doe", "phone": "444-555-6666", "email": "elpmaxe@niamod.moc"},
    # ],
    "active": True,
}

MOCK_INFO2_CAMEL = {
    "email": "test2@organization.com",
    "organizationAddress": "370 Highland Rd W",
    "organizationName": "Test2 Org",
    "organizationDesc": "Testing123",
    "organizationCoordinates": [-11.1, 11.1],
    # Real Coordinates:
    # "organizationCoordinates": [-80.5118701, 43.4384664],
    "role": "Donor",
    "roleInfo": {
        "aspInfo": None,
        "donorInfo": {
            "type": "Restaurant",
            "tags": ["Halal", "Vegan"],
        },
    },
    "primaryContact": {
        "name": "Mr. Goose",
        "phone": "98765",
        "email": "goose@gmail.com",
    },
    "initialOnsiteContacts": [],
    # "initialOnsiteContacts": [
    #     {"name": "def", "phone": "098-765-4321", "email": "def@uwblueprint.org"},
    #     {"name": "John Doe", "phone": "444-555-6666", "email": "elpmaxe@niamod.moc"},
    # ],
    "active": True,
}

MOCK_INFO3_SNAKE = {
    "email": "test3@organization.com",
    "organization_address": "170 University Ave W",
    "organization_name": "Test3 Org",
    "organization_desc": "Testing 123",
    "organization_coordinates": [-11.1, 11.1],
    # Real Coordinates:
    # "organization_coordinates": [-80.5373252901463, 43.472995850000004],
    "role": "Admin",
    "role_info": None,
    "primary_contact": {
        "name": "Anon ymous",
        "phone": "13579",
        "email": "anon@gmail.com",
    },
    "initial_onsite_contacts": [],
    # "initial_onsite_contacts": [
    #     {"name": "ghi", "phone": "135-792-4680", "email": "ghi@uwblueprint.org"},
    #     {"name": "Jack Doe", "phone": "777-888-999", "email": "com@domain.email"},
    # ],
    "active": False,
}

MOCK_INFO3_CAMEL = {
    "email": "test3@organization.com",
    "organizationAddress": "170 University Ave W",
    "organizationName": "Test3 Org",
    "organizationDesc": "Testing 123",
    # Real Coordinates:
    # "organizationCoordinates": [-80.5373252901463, 43.472995850000004],
    "organizationCoordinates": [-11.1, 11.1],
    "role": "Admin",
    "roleInfo": None,
    "primaryContact": {
        "name": "Anon ymous",
        "phone": "13579",
        "email": "anon@gmail.com",
    },
    "initialOnsiteContacts": [],
    # "initialOnsiteContacts": [
    #     {"name": "ghi", "phone": "135-792-4680", "email": "ghi@uwblueprint.org"},
    #     {"name": "Jack Doe", "phone": "777-888-999", "email": "com@domain.email"},
    # ],
    "active": False,
}

MOCK_USER1_SNAKE = {
    "auth_id": "1",
    "info": MOCK_INFO1_SNAKE,
}

MOCK_USER2_SNAKE = {
    "auth_id": "2",
    "info": MOCK_INFO2_SNAKE,
}

MOCK_USER3_SNAKE = {
    "auth_id": "3",
    "info": MOCK_INFO3_SNAKE,
}
MOCK_USER1_CAMEL = {
    "auth_id": "1",
    "info": MOCK_INFO1_CAMEL,
}

MOCK_USER2_CAMEL = {
    "auth_id": "2",
    "info": MOCK_INFO2_CAMEL,
}

MOCK_USER3_CAMEL = {
    "auth_id": "3",
    "info": MOCK_INFO3_CAMEL,
}


MOCK_MEALREQUEST1_SNAKE = {
    "status": "Open",
    "drop_off_datetime": "2025-03-31T00:00:00",
    "drop_off_location": "Test location",
    "meal_info": {
        "portions": 10,
        "dietary_restrictions": "Vegan",
    },
    "date_created": "2023-03-31T00:00:00",
    "date_updated": "2023-03-31T00:00:00",
    "delivery_instructions": "Test instructions",
    "donation_info": None,
}
