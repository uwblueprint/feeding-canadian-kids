from app.graphql.onboarding_request import ONBOARDING_REQUEST_EMAIL_ALREADY_EXISTS_ERROR
from app.models.onboarding_request import OnboardingRequest
from app.graphql import schema as graphql_schema
from tests.graphql.mock_test_data import (
    MOCK_INFO1_CAMEL,
    MOCK_INFO2_CAMEL,
    MOCK_INFO3_CAMEL,
)


def test_create_onboarding_request():
    mutation_string = """mutation testCreateOnboardingRequest {
                        createOnboardingRequest (
                            userInfo: {
                                email: "test3@organization.com",
                                organizationAddress: "170 University Ave W",
                                organizationName: "Test3 Org",
                                organizationDesc: "Testing 123",
                                organizationCoordinates: [
                                    43.472995850000004, -80.5373252901463
                                ],
                                role: "Admin",
                                primaryContact: {
                                    name: "Anon ymous",
                                    phone: "13579",
                                    email: "anon@gmail.com",
                                },
                                onsiteContacts: [
                                    {
                                        name: "ghi",
                                        phone: "135-792-4680",
                                        email: "ghi@uwblueprint.org"
                                    },
                                    {
                                        name: "Jack Doe",
                                        phone: "777-888-999",
                                        email: "com@domain.email"
                                    },
                                ],
                                active: false
                            }
                        ) {
                            onboardingRequest {
                                id
                                info {
                                    email
                                    organizationAddress
                                    organizationName
                                    organizationDesc
                                    organizationCoordinates
                                    role
                                    roleInfo {
                                        aspInfo {
                                            numKids
                                        }
                                        donorInfo {
                                            type
                                            tags
                                        }
                                    }
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
                                    active
                                }
                                dateSubmitted
                                status
                            }
                        }
                }"""
    result = graphql_schema.execute(mutation_string)
    onboarding_request_result = result.data["createOnboardingRequest"][
        "onboardingRequest"
    ]
    assert onboarding_request_result["id"] == str(onboarding_request_result["id"])
    assert onboarding_request_result["status"] == "Pending"
    assert onboarding_request_result["info"] == MOCK_INFO3_CAMEL
    OnboardingRequest.objects(id=onboarding_request_result["id"]).delete()


def test_create_onboarding_request_with_existing_email_errors():
    num_of_kids = 50
    result = graphql_schema.execute(
        f"""mutation testCreateOnboardingRequest {{
            createOnboardingRequest (
                userInfo: {{
                    email: "test1@organization.com",
                    organizationAddress: "255 King St N",
                    organizationName: "Test1 Org",
                    organizationDesc: "Testing 123",
                    organizationCoordinates: [43.477876300000005, -80.52565465],
                    role: "ASP",
                    roleInfo: {{
                        aspInfo: {{
                            numKids: {num_of_kids},
                        }},
                        donorInfo: null,
                    }},
                    primaryContact: {{
                        name: "Jessie",
                        phone: "123456",
                        email: "jessie123@gmail.com"
                    }},
                    onsiteContacts: [
                        {{
                            name: "abc",
                            phone: "123-456-7890",
                            email: "abc@uwblueprint.org"
                        }},
                        {{
                            name: "Jane Doe",
                            phone: "111-222-3333",
                            email: "example@domain.com"
                        }}
                    ],
                    active: true
                }}
            ) {{
                onboardingRequest {{
                    id
                    info {{
                        email
                        organizationAddress
                        organizationName
                        organizationDesc
                        organizationCoordinates
                        role
                        roleInfo {{
                            aspInfo {{
                                numKids
                            }}
                            donorInfo {{
                                type
                                tags
                            }}
                        }}
                        primaryContact {{
                            name
                            phone
                            email
                        }}
                        onsiteContacts {{
                            name
                            phone
                            email
                        }}
                        active
                    }}
                    dateSubmitted
                    status
                }}
            }}
        }}"""
    )
    assert result.errors is not None
    assert len(result.errors) == 1
    assert result.errors[0].message == ONBOARDING_REQUEST_EMAIL_ALREADY_EXISTS_ERROR


def test_get_all_requests(onboarding_request_setup):
    onboarding_request_1, onboarding_request_2 = onboarding_request_setup
    executed = graphql_schema.execute(
        """ {
                getAllOnboardingRequests {
                    id
                    info {
                        email
                        organizationAddress
                        organizationName
                        organizationDesc
                        organizationCoordinates
                        role
                        roleInfo {
                            aspInfo {
                                numKids
                            }
                            donorInfo {
                                type
                                tags
                            }
                        }
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
                        active
                    }
                    dateSubmitted
                    status
                }
            }"""
    )

    assert len(executed.data["getAllOnboardingRequests"]) == 2
    onboarding_request_result1 = executed.data["getAllOnboardingRequests"][0]
    assert onboarding_request_result1["id"] == str(onboarding_request_1.id)
    assert onboarding_request_result1["status"] == "Pending"
    assert onboarding_request_result1["info"] == MOCK_INFO1_CAMEL

    onboarding_request_result2 = executed.data["getAllOnboardingRequests"][1]
    assert onboarding_request_result2["id"] == str(onboarding_request_2.id)
    assert onboarding_request_result2["status"] == "Approved"
    assert onboarding_request_result2["info"] == MOCK_INFO2_CAMEL


def test_filter_requests_by_role(onboarding_request_setup):
    onboarding_request_1, onboarding_request_2 = onboarding_request_setup
    executed = graphql_schema.execute(
        """ {
                getAllOnboardingRequests(role: "Donor") {
                    id
                    info {
                        email
                        organizationAddress
                        organizationName
                        organizationDesc
                        organizationCoordinates
                        role
                        roleInfo {
                            aspInfo {
                                numKids
                            }
                            donorInfo {
                                type
                                tags
                            }
                        }
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
                        active
                    }
                    dateSubmitted
                    status
                }
            }"""
    )

    assert len(executed.data["getAllOnboardingRequests"]) == 1
    onboarding_request_result = executed.data["getAllOnboardingRequests"][0]
    assert onboarding_request_result["id"] == str(onboarding_request_2.id)
    assert onboarding_request_result["status"] == "Approved"
    assert onboarding_request_result["info"] == MOCK_INFO2_CAMEL


def test_filter_requests_by_status(onboarding_request_setup):
    onboarding_request_1, onboarding_request_2 = onboarding_request_setup
    executed = graphql_schema.execute(
        """ {
                getAllOnboardingRequests(status: "Pending") {
                    id
                    info {
                        email
                        organizationAddress
                        organizationName
                        organizationDesc
                        organizationCoordinates
                        role
                        roleInfo {
                            aspInfo {
                                numKids
                            }
                            donorInfo {
                                type
                                tags
                            }
                        }
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
                        active
                    }
                    dateSubmitted
                    status
                }
            }"""
    )

    assert len(executed.data["getAllOnboardingRequests"]) == 1
    onboarding_request_result = executed.data["getAllOnboardingRequests"][0]
    assert onboarding_request_result["id"] == str(onboarding_request_1.id)
    assert onboarding_request_result["status"] == "Pending"
    assert onboarding_request_result["info"] == MOCK_INFO1_CAMEL


def test_get_requests_by_id(onboarding_request_setup):
    onboarding_request_1, onboarding_request_2 = onboarding_request_setup
    executed = graphql_schema.execute(
        f"""{{
            getOnboardingRequestById(id: "{str(onboarding_request_2.id)}") {{
                id
                info {{
                    email
                    organizationAddress
                    organizationName
                    organizationDesc
                    organizationCoordinates
                    role
                    roleInfo {{
                        aspInfo {{
                            numKids
                        }}
                        donorInfo {{
                            type
                            tags
                        }}
                    }}
                    primaryContact {{
                        name
                        phone
                        email
                    }}
                    onsiteContacts {{
                        name
                        phone
                        email
                    }}
                    active
                }}
                dateSubmitted
                status
            }}
        }}"""
    )

    onboarding_request_result = executed.data["getOnboardingRequestById"]
    assert onboarding_request_result["id"] == str(onboarding_request_2.id)
    assert onboarding_request_result["status"] == "Approved"
    assert onboarding_request_result["info"] == MOCK_INFO2_CAMEL


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
