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


def assert_user_infos_equal(data_result, expected_result):
    assert data_result["email"] == expected_result["email"]
    assert (
        data_result["organization_address"] == expected_result["organization_address"]
    )
    assert data_result["organization_name"] == expected_result["organization_name"]
    assert data_result["role"] == expected_result["role"]
    assert (
        data_result["primary_contact"]["name"]
        == expected_result["primary_contact"]["name"]
    )
    assert (
        data_result["primary_contact"]["phone"]
        == expected_result["primary_contact"]["phone"]
    )
    assert (
        data_result["primary_contact"]["email"]
        == expected_result["primary_contact"]["email"]
    )
    assert len(data_result["onsite_contacts"]) == len(
        expected_result["onsite_contacts"]
    )
    for i in range(len(expected_result["onsite_contacts"])):
        assert (
            data_result["onsite_contacts"][i]["name"]
            == expected_result["onsite_contacts"][i]["name"]
        )
        assert (
            data_result["onsite_contacts"][i]["phone"]
            == expected_result["onsite_contacts"][i]["phone"]
        )
        assert (
            data_result["onsite_contacts"][i]["email"]
            == expected_result["onsite_contacts"][i]["email"]
        )


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
    assert user_info_result["status"] == "Pending"
    assert_user_infos_equal(user_info_result, mock_info1_snake)


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

    assert (
        executed["data"]["getAllOnboardingRequests"][0]["dateSubmitted"]
        == mock_date.isoformat()
    )
    assert executed["data"]["getAllOnboardingRequests"][0]["status"] == "Pending"
    assert_user_infos_equal(
        executed["data"]["getAllOnboardingRequests"][0], mock_info1_camel
    )

    assert (
        executed["data"]["getAllOnboardingRequests"][0]["dateSubmitted"]
        == mock_date.isoformat()
    )
    assert executed["data"]["getAllOnboardingRequests"][0]["status"] == "Approved"
    assert_user_infos_equal(
        executed["data"]["getAllOnboardingRequests"][0], mock_info2_camel
    )


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

    assert (
        executed["data"]["getAllOnboardingRequests"][0]["dateSubmitted"]
        == mock_date.isoformat()
    )
    assert executed["data"]["getAllOnboardingRequests"][0]["status"] == "Pending"
    assert_user_infos_equal(
        executed["data"]["getAllOnboardingRequests"][0], mock_info2_camel
    )


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

    assert (
        executed["data"]["getAllOnboardingRequests"][0]["dateSubmitted"]
        == mock_date.isoformat()
    )
    assert executed["data"]["getAllOnboardingRequests"][0]["status"] == "Approved"
    assert_user_infos_equal(
        executed["data"]["getAllOnboardingRequests"][0], mock_info2_camel
    )


def test_get_requests_by_id(mocker):
    mock_date = datetime.datetime.now()
    mock_result = [
        OnboardingRequest(
            info=mock_user_info1, status="Pending", date_submitted=mock_date
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

    assert (
        executed["data"]["getOnboardingRequestById"][0]["dateSubmitted"]
        == mock_date.isoformat()
    )
    assert executed["data"]["getOnboardingRequestById"][0]["status"] == "Pending"
    assert_user_infos_equal(
        executed["data"]["getAllOnboardingRequests"][0], mock_info1_camel
    )


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
