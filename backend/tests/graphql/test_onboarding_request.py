import datetime

from app.graphql import schema as graphql_schema
from app.models.onboarding_request import OnboardingRequest
from app.models.user_info import UserInfo
from app.resources.onboarding_request_dto import OnboardingRequestDTO

# Testing Mock Data

mock_info1 = UserInfo(
    contact_name="Jessie",
    contact_email="jessie123@gmail.com",
    contact_phone="123456",
    email="test1@organization.com",
    organization_address="123 Anywhere Street",
    organization_name="Test1 Org",
    role="ASP",
)

mock_info2 = UserInfo(
    contact_name="Mr. Goose",
    contact_email="goose@gmail.com",
    contact_phone="98765",
    email="test2@organization.com",
    organization_address="456 Anywhere Street",
    organization_name="Test2 Org",
    role="Donor",
)


def convert_to_dtos(mock_result):
    mock_result_dtos = []
    for request_dict in mock_result:
        kwargs = {
            "contact_name": request_dict["info"]["contact_name"],
            "contact_email": request_dict["info"]["contact_email"],
            "contact_phone": request_dict["info"]["contact_phone"],
            "email": request_dict["info"]["email"],
            "organization_address": request_dict["info"]["organization_address"],
            "organization_name": request_dict["info"]["organization_name"],
            "role": request_dict["info"]["role"],
            "date_submitted": request_dict["date_submitted"],
            "status": request_dict["status"],
        }
        mock_result_dtos.append(OnboardingRequestDTO(**kwargs))
    return mock_result_dtos


def test_create_onboarding_request():
    query_string = """mutation testCreateOnboardingRequest {
                        createOnboardingRequest(
                            userInfo:
                                {
                                contactName: "Jane Doe",
                                contactEmail: "janedoe@email.com",
                                contactPhone: "12345",
                                email: "test3@organization.com",
                                organizationAddress: "789 Anywhere Street",
                                organizationName" "Test3 Org",
                                role: "ASP"
                                }
                        ) {
                            onboardingRequest {
                            id
                            info {
                                contactName,
                                contactEmail,
                                contactPhone,
                                email,
                                organizationAddress,
                                organizationName,
                                role
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
    assert user_info_result
    assert user_info_result["contactName"] == "Jane Doe"
    assert user_info_result["contactEmail"] == "janedoe@email.com"
    assert user_info_result["contactPhone"] == "12345"
    assert user_info_result["email"] == "test3@organization.com"
    assert user_info_result["organizationAddress"] == "789 Anywhere Street"
    assert user_info_result["organizationName"] == "Test3 Org"
    assert user_info_result["role"] == "ASP"
    assert onboarding_request_result["status"] == "Pending"


def test_get_all_requests(mocker):
    mock_date = datetime.datetime.now()
    mock_result = [
        OnboardingRequest(
            info=mock_info1, status="Pending", date_submitted=mock_date
        ).to_serializable_dict(),
        OnboardingRequest(
            info=mock_info2, status="Approved", date_submitted=mock_date
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
                contactName
                contactEmail
                contactPhone
                email
                organizationAddress
                organizationName
                role
                dateSubmitted
                status
                }
            }"""
    )

    expected_result = {
        "data": {
            "getAllOnboardingRequests": [
                {
                    "contactName": "Jessie",
                    "contactEmail": "jessie123@gmail.com",
                    "contactPhone": "123456",
                    "email": "test1@organization.com",
                    "organizationAddress": "123 Anywhere Street",
                    "organizationName": "Test1 Org",
                    "role": "ASP",
                    "dateSubmitted": mock_date.isoformat(),
                    "status": "Pending",
                },
                {
                    "contactName": "Mr. Goose",
                    "contactEmail": "goose@gmail.com",
                    "contactPhone": "98765",
                    "email": "test2@organization.com",
                    "organizationAddress": "456 Anywhere Street",
                    "organizationName": "Test2 Org",
                    "role": "Donor",
                    "dateSubmitted": mock_date.isoformat(),
                    "status": "Approved",
                },
            ]
        }
    }

    assert executed.data == expected_result["data"]


def test_filter_requests_by_role(mocker):
    mock_date = datetime.datetime.now()
    mock_result = [
        OnboardingRequest(
            info=mock_info2, status="Pending", date_submitted=mock_date
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
                contactName
                contactEmail
                contactPhone
                email
                organizationAddress
                organizationName
                role
                dateSubmitted
                status
                }
            }"""
    )

    expected_result = {
        "data": {
            "getAllOnboardingRequests": [
                {
                    "contactName": "Mr. Goose",
                    "contactEmail": "goose@gmail.com",
                    "contactPhone": "98765",
                    "email": "test2@organization.com",
                    "organizationAddress": "456 Anywhere Street",
                    "organizationName": "Test2 Org",
                    "role": "Donor",
                    "dateSubmitted": mock_date.isoformat(),
                    "status": "Pending",
                },
            ]
        }
    }

    assert executed.data == expected_result["data"]


def test_filter_requests_by_status(mocker):
    mock_date = datetime.datetime.now()
    mock_result = [
        OnboardingRequest(
            info=mock_info2, status="Approved", date_submitted=mock_date
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
                contactName
                contactEmail
                contactPhone
                email
                organizationAddress
                organizationName
                role
                dateSubmitted
                status
                }
            }"""
    )

    expected_result = {
        "data": {
            "getAllOnboardingRequests": [
                {
                    "contactName": "Mr. Goose",
                    "contactEmail": "goose@gmail.com",
                    "contactPhone": "98765",
                    "email": "test2@organization.com",
                    "organizationAddress": "456 Anywhere Street",
                    "organizationName": "Test2 Org",
                    "role": "Donor",
                    "dateSubmitted": mock_date.isoformat(),
                    "status": "Approved",
                },
            ]
        }
    }

    assert executed.data == expected_result["data"]


def test_get_requests_by_id(mocker):
    mock_date = datetime.datetime.now()
    mock_result = [
        OnboardingRequest(
            info=mock_info1, status="Pending", date_submitted=mock_date
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
                contactName
                contactEmail
                contactPhone
                email
                organizationAddress
                organizationName
                role
                dateSubmitted
                status
                }
            }"""
    )

    expected_result = {
        "data": {
            "getOnboardingRequestById": [
                {
                    "contactName": "Jessie",
                    "contactEmail": "jessie123@gmail.com",
                    "contactPhone": "123456",
                    "email": "test1@organization.com",
                    "organizationAddress": "123 Anywhere Street",
                    "organizationName": "Test1 Org",
                    "role": "ASP",
                    "dateSubmitted": mock_date.isoformat(),
                    "status": "Pending",
                },
            ]
        }
    }

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
