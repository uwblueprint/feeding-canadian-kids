from app.graphql import schema as graphql_schema


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
