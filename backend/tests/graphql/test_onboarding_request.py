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
    role="ASP",
)

mock_info2 = UserInfo(
    contact_name="Mr. Goose",
    contact_email="goose@gmail.com",
    contact_phone="98765",
    role="Donor",
)


def convert_to_dtos(mock_result):
    mock_result_dtos = []
    for request_dict in mock_result:
        kwargs = {
            "contact_name": request_dict["info"]["contact_name"],
            "contact_email": request_dict["info"]["contact_email"],
            "contact_phone": request_dict["info"]["contact_phone"],
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
                                {contactName: "Jane Doe",
                                contactEmail: "janedoe@email.com",
                                contactPhone: "12345",
                                role: "ASP"
                                }
                        ) {
                            onboardingRequest {
                            id
                            info {
                                contactName,
                                contactEmail,
                                contactPhone,
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
                    "role": "ASP",
                    "dateSubmitted": mock_date.isoformat(),
                    "status": "Pending",
                },
                {
                    "contactName": "Mr. Goose",
                    "contactEmail": "goose@gmail.com",
                    "contactPhone": "98765",
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
                    "role": "ASP",
                    "dateSubmitted": mock_date.isoformat(),
                    "status": "Pending",
                },
            ]
        }
    }

    assert executed.data == expected_result["data"]



#TODO
#def test_approve_onboading_request():

    




    
