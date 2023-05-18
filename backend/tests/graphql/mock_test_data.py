MOCK_INFO1_SNAKE = {
    "email": "test1@organization.com",
    "organization_address": "123 Anywhere Street",
    "organization_name": "Test1 Org",
    "role": "ASP",
    "primary_contact": {
        "name": "Jessie",
        "phone": "123456",
        "email": "jessie123@gmail.com",
    },
    "onsite_contacts": [
        {"name": "abc", "phone": "123-456-7890", "email": "abc@uwblueprint.org"},
        {"name": "Jane Doe", "phone": "111-222-3333", "email": "example@domain.com"},
    ],
}

MOCK_INFO1_CAMEL = {
    "email": "test1@organization.com",
    "organizationAddress": "123 Anywhere Street",
    "organizationName": "Test1 Org",
    "role": "ASP",
    "primaryContact": {
        "name": "Jessie",
        "phone": "123456",
        "email": "jessie123@gmail.com",
    },
    "onsiteContacts": [
        {"name": "abc", "phone": "123-456-7890", "email": "abc@uwblueprint.org"},
        {"name": "Jane Doe", "phone": "111-222-3333", "email": "example@domain.com"},
    ],
}

MOCK_INFO2_SNAKE = {
    "email": "test2@organization.com",
    "organization_address": "456 Anywhere Street",
    "organization_name": "Test2 Org",
    "role": "Donor",
    "primary_contact": {
        "name": "Mr. Goose",
        "phone": "98765",
        "email": "goose@gmail.com",
    },
    "onsite_contacts": [
        {"name": "def", "phone": "098-765-4321", "email": "def@uwblueprint.org"},
        {"name": "John Doe", "phone": "444-555-6666", "email": "elpmaxe@niamod.moc"},
    ],
}

MOCK_INFO2_CAMEL = {
    "email": "test2@organization.com",
    "organizationAddress": "456 Anywhere Street",
    "organizationName": "Test2 Org",
    "role": "Donor",
    "primaryContact": {
        "name": "Mr. Goose",
        "phone": "98765",
        "email": "goose@gmail.com",
    },
    "onsiteContacts": [
        {"name": "def", "phone": "098-765-4321", "email": "def@uwblueprint.org"},
        {"name": "John Doe", "phone": "444-555-6666", "email": "elpmaxe@niamod.moc"},
    ],
}

MOCK_INFO3_SNAKE = {
    "email": "test3@organization.com",
    "organization_address": "789 Anywhere Street",
    "organization_name": "Test3 Org",
    "role": "Admin",
    "primary_contact": {
        "name": "Anon ymous",
        "phone": "13579",
        "email": "anon@gmail.com",
    },
    "onsite_contacts": [
        {"name": "ghi", "phone": "135-792-4680", "email": "ghi@uwblueprint.org"},
        {"name": "Jack Doe", "phone": "777-888-999", "email": "com@domain.email"},
    ],
}

MOCK_INFO3_CAMEL = {
    "email": "test3@organization.com",
    "organizationAddress": "789 Anywhere Street",
    "organizationName": "Test3 Org",
    "role": "Admin",
    "primaryContact": {
        "name": "Anon ymous",
        "phone": "13579",
        "email": "anon@gmail.com",
    },
    "onsiteContacts": [
        {"name": "ghi", "phone": "135-792-4680", "email": "ghi@uwblueprint.org"},
        {"name": "Jack Doe", "phone": "777-888-999", "email": "com@domain.email"},
    ],
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
