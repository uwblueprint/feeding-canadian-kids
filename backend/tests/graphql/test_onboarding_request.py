from app.graphql.onboarding_request import ONBOARDING_REQUEST_EMAIL_ALREADY_EXISTS_ERROR
from app.models.onboarding_request import OnboardingRequest
from app.graphql import schema as graphql_schema
from app.services.implementations.mock_email_service import MockEmailService
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
                                role: "Admin",
                                primaryContact: {
                                    name: "Anon ymous",
                                    phone: "13579",
                                    email: "anon@gmail.com",
                                },
                                initialOnsiteContacts: [],
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
                                    initialOnsiteContacts {
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
                    initialOnsiteContacts: [],
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
                        initialOnsiteContacts {{
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
                        initialOnsiteContacts {
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
                        initialOnsiteContacts {
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
                        initialOnsiteContacts {
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
                    initialOnsiteContacts {{
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


def test_approve_onboarding_request():
    query_string = """
    mutation testCreateOnboardingRequest {
        createOnboardingRequest(userInfo:
                    {
                        email: "test@test.com",
                        organizationAddress: "123 Test St",
                        organizationName: "Test Org",
                        organizationDesc: "TestDescp",
                        role: "ASP",
                        roleInfo: {
                            aspInfo:
                            {
                                    numKids: 10,
                            }
                        },
                        primaryContact: {
                            name: "Bob Joe",
                            email: "bob@joe.com",
                            phone: "123-123-1234",
                        },
                        initialOnsiteContacts: [
                            {
                                name: "Bob Joe",
                                email: "bob@joe.com",
                                phone: "123-123-1234",
                            },
                            {
                                name: "Bob Joe 2",
                                email: "bob2@joe.com",
                                phone: "222-123-1234",
                            },
                        ],
                    }
        ) {
        onboardingRequest {
            id
        }
    }
}
    """
    result = graphql_schema.execute(query_string)
    assert result.errors is None

    result_id = result.data["createOnboardingRequest"]["onboardingRequest"]["id"]

    result = graphql_schema.execute(
        """ mutation OnboardRequest($id: ID!){
                approveOnboardingRequest(id: $id) {
                    onboardingRequest {
                        id
                        info{
                            email,
                            organizationAddress,
                            organizationName,
                            organizationDesc,
                            role,
                            roleInfo {
                                aspInfo {
                                    numKids
                                }
                                donorInfo {
                                    type
                                    tags
                                }
                            }
                        }
                    }
            }
        }""",
        variables={"id": result_id},
    )

    assert result.errors is None
    approve_request_result = result.data["approveOnboardingRequest"][
        "onboardingRequest"
    ]
    print(approve_request_result)

    assert approve_request_result["id"] == result_id
    assert approve_request_result["info"]["email"] == "test@test.com"
    assert approve_request_result["info"]["organizationAddress"] == "123 Test St"
    assert approve_request_result["info"]["organizationName"] == "Test Org"
    assert approve_request_result["info"]["organizationDesc"] == "TestDescp"
    assert approve_request_result["info"]["role"] == "ASP"
    assert approve_request_result["info"]["roleInfo"]["aspInfo"]["numKids"] == 10

    email_service = MockEmailService.instance
    assert email_service is not None

    last_email = email_service.get_last_email_sent()
    assert last_email is not None
    assert last_email["subject"] == "Onboarding request approved. Set Password"
    assert last_email["to"] == "test@test.com"
    # TODO: BEN Please change this to load from your new email management framework.
    assert last_email["body"].startswith(
        """
            Hello,
            <br><br>
            We have received your onboarding request and it has been approved.
            Please set your password using the following link.
            <br><br>
            """
    )
    assert (
        last_email["from_"]
        == "Feeding Canadian Kids <feedingcanadiankids@uwblueprint.org>"
    )
