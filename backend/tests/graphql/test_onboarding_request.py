import datetime

from app.graphql import schema as graphql_schema
from app.models.onboarding_request import OnboardingRequest
from app.resources.onboarding_request_dto import OnboardingRequestDTO
from tests.graphql.mock_test_data import (
    MOCK_USER_INFO1,
    MOCK_USER_INFO2,
    MOCK_INFO1_CAMEL,
    MOCK_INFO2_CAMEL,
)


def convert_to_onboarding_request_dtos(mock_result):
    mock_result_dtos = []
    for request_dict in mock_result:
        kwargs = {
            "id": request_dict["id"],
            "info": request_dict["info"],
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
    assert onboarding_request_result["status"] == "Pending"
    assert onboarding_request_result["info"] == MOCK_INFO1_CAMEL


def test_get_all_requests(mocker):
    mock_date = datetime.datetime.now()
    mock_result = [
        OnboardingRequest(
            info=MOCK_USER_INFO1, status="Pending", date_submitted=mock_date
        ).to_serializable_dict(),
        OnboardingRequest(
            info=MOCK_USER_INFO2, status="Approved", date_submitted=mock_date
        ).to_serializable_dict(),
    ]

    mock_result_dtos = convert_to_onboarding_request_dtos(mock_result)

    mocker.patch(
        "app.services.implementations.onboarding_request_service."
        "OnboardingRequestService.get_all_onboarding_requests",
        return_value=mock_result_dtos,
    )

    executed = graphql_schema.execute(
        """ {
             getAllOnboardingRequests(number: 5, offset: 0) {
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
            }"""
    )

    onboarding_request_result1 = executed.data["getAllOnboardingRequests"][0]
    assert onboarding_request_result1["dateSubmitted"] == mock_date.isoformat()
    assert onboarding_request_result1["status"] == "Pending"
    assert onboarding_request_result1["info"] == MOCK_INFO1_CAMEL

    onboarding_request_result1 = executed.data["getAllOnboardingRequests"][1]
    assert onboarding_request_result1["dateSubmitted"] == mock_date.isoformat()
    assert onboarding_request_result1["status"] == "Approved"
    assert onboarding_request_result1["info"] == MOCK_INFO2_CAMEL


def test_filter_requests_by_role(mocker):
    mock_date = datetime.datetime.now()
    mock_result = [
        OnboardingRequest(
            info=MOCK_USER_INFO1, status="Pending", date_submitted=mock_date
        ).to_serializable_dict(),
    ]
    mock_result_dtos = convert_to_onboarding_request_dtos(mock_result)

    mocker.patch(
        "app.services.implementations.onboarding_request_service."
        "OnboardingRequestService.get_all_onboarding_requests",
        return_value=mock_result_dtos,
    )

    executed = graphql_schema.execute(
        """ {
             getAllOnboardingRequests(role: "ASP") {
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
            }"""
    )

    onboarding_request_result = executed.data["getAllOnboardingRequests"][0]
    assert onboarding_request_result["dateSubmitted"] == mock_date.isoformat()
    assert onboarding_request_result["status"] == "Pending"
    assert onboarding_request_result["info"] == MOCK_INFO1_CAMEL


def test_filter_requests_by_status(mocker):
    mock_date = datetime.datetime.now()
    mock_result = [
        OnboardingRequest(
            info=MOCK_USER_INFO2, status="Approved", date_submitted=mock_date
        ).to_serializable_dict(),
    ]

    mock_result_dtos = convert_to_onboarding_request_dtos(mock_result)

    mocker.patch(
        "app.services.implementations.onboarding_request_service."
        "OnboardingRequestService.get_all_onboarding_requests",
        return_value=mock_result_dtos,
    )

    executed = graphql_schema.execute(
        """ {
             getAllOnboardingRequests(status: "Approved") {
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
            }"""
    )

    onboarding_request_result = executed.data["getAllOnboardingRequests"][0]
    assert onboarding_request_result["dateSubmitted"] == mock_date.isoformat()
    assert onboarding_request_result["status"] == "Approved"
    assert onboarding_request_result["info"] == MOCK_INFO2_CAMEL


def test_get_requests_by_id(mocker):
    mock_date = datetime.datetime.now()
    mock_result = [
        OnboardingRequest(
            info=MOCK_USER_INFO1, status="Pending", date_submitted=mock_date
        ).to_serializable_dict()
    ]
    mock_result[0]["id"] = "0"

    mock_result_dtos = convert_to_onboarding_request_dtos(mock_result)

    mocker.patch(
        "app.services.implementations.onboarding_request_service."
        "OnboardingRequestService.get_onboarding_request_by_id",
        return_value=mock_result_dtos[0],
    )

    executed = graphql_schema.execute(
        """ {
             getOnboardingRequestById(id: "0") {
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
            }"""
    )

    onboarding_request_result = executed.data["getOnboardingRequestById"]
    assert onboarding_request_result["dateSubmitted"] == mock_date.isoformat()
    assert onboarding_request_result["status"] == "Pending"
    assert onboarding_request_result["info"] == MOCK_INFO1_CAMEL


# def test_approve_onboarding_request():
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
