import datetime

from app.graphql import schema as graphql_schema
from app.models.onboarding_request import OnboardingRequest
from app.models.user_info import UserInfo
from app.resources.onboarding_request_dto import OnboardingRequestDTO

# Testing Mock Data

mock_info1_snake = {
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

mock_info1_camel = {
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


mock_info2_snake = {
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
        {"name": "def", "phone": "098-765-4321", "email": "abc@uwblueprint.org"},
        {"name": "John Doe", "phone": "444-555-6666", "email": "elpmaxe@niamod.moc"},
    ],
}

mock_info2_camel = {
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
        {"name": "def", "phone": "098-765-4321", "email": "abc@uwblueprint.org"},
        {"name": "John Doe", "phone": "444-555-6666", "email": "elpmaxe@niamod.moc"},
    ],
}

mock_user_info1 = UserInfo(**mock_info1_snake)

mock_user_info2 = UserInfo(**mock_info2_snake)


def convert_to_dtos(mock_result):
    mock_result_dtos = []
    for request_dict in mock_result:
        kwargs = {
            "email": request_dict["info"]["email"],
            "organization_address": request_dict["info"]["organization_address"],
            "organization_name": request_dict["info"]["organization_name"],
            "role": request_dict["info"]["role"],
            "primary_contact": request_dict["info"]["primary_contact"],
            "onsite_contacts": request_dict["info"]["onsite_contacts"],
            "date_submitted": request_dict["date_submitted"],
            "status": request_dict["status"],
        }
        mock_result_dtos.append(OnboardingRequestDTO(**kwargs))
    return mock_result_dtos


def test_create_onboarding_request():
    query_string = """mutation testCreateOnboardingRequest {
                        createOnboardingRequest (
                            userInfo: {
                                email: "test1@organization.com",
                                organizationAddress: "123 Anywhere Street",
                                organizationName: "Test1 Org",
                                role: "ASP",
                                primaryContact: {
                                    name: "Jessie",
                                    phone: "123456",
                                    email: "jessie123@gmail.com"
                                },
                                onsiteContacts: [
                                    {
                                        name: "abc",
                                        phone: "123-456-7890",
                                        email: "abc@uwblueprint.org"
                                    },
                                    {
                                        name: "Jane Doe",
                                        phone: "111-222-3333",
                                        email: "example@domain.com"
                                    }
                                ]
                            }
                        ) {
                            onboardingRequest {
                                id
                                info {
                                    email
                                    organizationAddress
                                    organizationName
                                    role
                                    primaryContact {
                                        name
                                        phone
                                        email
                                    }
                                    onsiteContacts {
                                        name
                                        phone
                                        email
                                    }
                                }
                                dateSubmitted
                                status
                            }
                        }
                    }"""
    result = graphql_schema.execute(query_string)
    onboarding_request_result = result.data["createOnboardingRequest"][
        "onboardingRequest"
    ]
    user_info_result = onboarding_request_result["info"]
    assert user_info_result.status == "Pending"
    assert user_info_result.info.email == mock_info1_snake.email
    assert (
        user_info_result.info.organization_address
        == mock_info1_snake.organization_address
    )
    assert user_info_result.info.organization_name == mock_info1_snake.organization_name
    assert user_info_result.info.role == mock_info1_snake.role
    assert (
        user_info_result.info.primary_contact.name
        == mock_info1_snake.primary_contact.name
    )
    assert (
        user_info_result.info.primary_contact.phone
        == mock_info1_snake.primary_contact.phone
    )
    assert (
        user_info_result.info.primary_contact.email
        == mock_info1_snake.primary_contact.email
    )
    assert len(user_info_result.info.onsite_contacts) == len(
        mock_info1_snake.onsite_contacts
    )
    for i in range(len(mock_info1_snake.onsite_contacts)):
        assert (
            user_info_result.info.onsite_contacts[i].name
            == mock_info1_snake.onsite_contacts[i].name
        )
        assert (
            user_info_result.info.onsite_contacts[i].phone
            == mock_info1_snake.onsite_contacts[i].phone
        )
        assert (
            user_info_result.info.onsite_contacts[i].email
            == mock_info1_snake.onsite_contacts[i].email
        )


def test_get_all_requests(mocker):
    mock_date = datetime.datetime.now()
    mock_result = [
        OnboardingRequest(
            info=mock_user_info1, status="Pending", date_submitted=mock_date
        ).to_serializable_dict(),
        OnboardingRequest(
            info=mock_user_info2, status="Approved", date_submitted=mock_date
        ).to_serializable_dict(),
    ]

    mock_result_dtos = convert_to_dtos(mock_result)

    mocker.patch(
        "app.services.implementations.onboarding_request_service."
        "OnboardingRequestService.get_all_onboarding_requests",
        return_value=mock_result_dtos,
    )

    executed = graphql_schema.execute(
        """ {
             getAllOnboardingRequests(number: 5, offset: 0) {
                    email
                    organizationAddress
                    organizationName
                    role
                    primaryContact {
                        name
                        phone
                        email
                    }
                    onsiteContacts {
                        name
                        phone
                        email
                    }
                }
            }"""
    )

    expected_result = {
        "data": {"getAllOnboardingRequests": [mock_info1_camel, mock_info2_camel]}
    }
    expected_result["data"]["getAllOnboardingRequests"][0][
        "dateSubmitted"
    ] = mock_date.isoformat()
    expected_result["data"]["getAllOnboardingRequests"][0]["status"] = "Pending"
    expected_result["data"]["getAllOnboardingRequests"][1][
        "dateSubmitted"
    ] = mock_date.isoformat()
    expected_result["data"]["getAllOnboardingRequests"][1]["status"] = "Approved"

    assert executed.data == expected_result["data"]


def test_filter_requests_by_role(mocker):
    mock_date = datetime.datetime.now()
    mock_result = [
        OnboardingRequest(
            info=mock_user_info2, status="Pending", date_submitted=mock_date
        ).to_serializable_dict(),
    ]
    mock_result_dtos = convert_to_dtos(mock_result)

    mocker.patch(
        "app.services.implementations.onboarding_request_service."
        "OnboardingRequestService.get_all_onboarding_requests",
        return_value=mock_result_dtos,
    )

    executed = graphql_schema.execute(
        """ {
             getAllOnboardingRequests(role: "Donor") {
                email
                organizationAddress
                organizationName
                role
                primaryContact {
                    name
                    phone
                    email
                }
                onsiteContacts {
                    name
                    phone
                    email
                }
                dateSubmitted
                status
                }
            }"""
    )

    expected_result = {
        "data": {
            "getAllOnboardingRequests": [
                mock_info2_camel,
            ]
        }
    }
    expected_result["data"]["getAllOnboardingRequests"][0][
        "dateSubmitted"
    ] = mock_date.isoformat()
    expected_result["data"]["getAllOnboardingRequests"][0]["status"] = "Pending"

    assert executed.data == expected_result["data"]


def test_filter_requests_by_status(mocker):
    mock_date = datetime.datetime.now()
    mock_result = [
        OnboardingRequest(
            info=mock_user_info2, status="Approved", date_submitted=mock_date
        ).to_serializable_dict(),
    ]

    mock_result_dtos = convert_to_dtos(mock_result)

    mocker.patch(
        "app.services.implementations.onboarding_request_service."
        "OnboardingRequestService.get_all_onboarding_requests",
        return_value=mock_result_dtos,
    )

    executed = graphql_schema.execute(
        """ {
             getAllOnboardingRequests(status: "Approved") {
                email
                organizationAddress
                organizationName
                role
                primaryContact {
                    name
                    phone
                    email
                }
                onsiteContacts {
                    name
                    phone
                    email
                }
                dateSubmitted
                status
                }
            }"""
    )

    expected_result = {
        "data": {
            "getAllOnboardingRequests": [
                mock_info2_camel,
            ]
        }
    }
    expected_result["data"]["getAllOnboardingRequests"][0][
        "dateSubmitted"
    ] = mock_date.isoformat()
    expected_result["data"]["getAllOnboardingRequests"][0]["status"] = "Approved"

    assert executed.data == expected_result["data"]


def test_get_requests_by_id(mocker):
    mock_date = datetime.datetime.now()
    mock_result = [
        OnboardingRequest(
            info=mock_info1_snake, status="Pending", date_submitted=mock_date
        ).to_serializable_dict()
    ]

    mock_result[0]["id"] = "0"

    mock_result_dtos = convert_to_dtos(mock_result)

    mocker.patch(
        "app.services.implementations.onboarding_request_service."
        "OnboardingRequestService.get_onboarding_request_by_id",
        return_value=mock_result_dtos[0],
    )

    executed = graphql_schema.execute(
        """ {
             getOnboardingRequestById(id: "0") {
                email
                organizationAddress
                organizationName
                role
                primaryContact {
                    name
                    phone
                    email
                }
                onsiteContacts {
                    name
                    phone
                    email
                }
                dateSubmitted
                status
                }
            }"""
    )

    expected_result = {"data": {"getOnboardingRequestById": [mock_info1_camel]}}
    expected_result["data"]["getOnboardingRequestById"][0][
        "dateSubmitted"
    ] = mock_date.isoformat()
    expected_result["data"]["getOnboardingRequestById"][0]["status"] = "Pending"

    assert executed.data == expected_result["data"]


# def test_approve_onboading_request():
#     query_string = """mutation testCreateOnboardingRequest {
#         createOnboardingRequest(
#             userInfo:
#                 {contactName: "Jane Doe",
#                 contactEmail: "abubakarbello@uwblueprint.org",
#                 contactPhone: "12345",
#                 role: "ASP"
#                 }
#         ) {
#             onboardingRequest {
#             id
#             info {
#                 contactName,
#                 contactEmail,
#                 contactPhone,
#                 role
#             }
#             dateSubmitted
#             status
#             }
#         }
#     }"""
#     result = graphql_schema.execute(query_string)
#     result_id = result.data["createOnboardingRequest"]["onboardingRequest"]["id"]

#     executed = graphql_schema.execute(
#         """ mutation OnboardRequest($id: ID!){
#                 approveOnboardingRequest(id: $id) {
#                     onboardingRequest {
#                     id
#                     status
#                     info {
#                         contactName,
#                         contactEmail,
#                         contactPhone,
#                     }
#                     dateSubmitted
#                     status
#                 }
#             }
#         }""",
#         variables={"id": result_id},
#     )

#     expected_result = {
#         "id": result_id,
#         "status": "Approved",
#         "info": {
#             "contactName": "Jane Doe",
#             "contactEmail": "abubakarbello@uwblueprint.org",
#             "contactPhone": "12345",
#         },
#     }

#     approve_request_result = executed.data["approveOnboardingRequest"][
#         "onboardingRequest"
#     ]

#     assert approve_request_result["id"] == expected_result["id"]
#     assert (
#         approve_request_result["info"]["contactName"]
#         == expected_result["info"]["contactName"]
#     )
#     assert (
#         approve_request_result["info"]["contactEmail"]
#         == expected_result["info"]["contactEmail"]
#     )
#     assert (
#         approve_request_result["info"]["contactPhone"]
#         == expected_result["info"]["contactPhone"]
#     )
#     assert approve_request_result["status"] == expected_result["status"]
