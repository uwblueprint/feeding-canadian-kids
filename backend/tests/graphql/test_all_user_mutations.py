from app.graphql import schema as graphql_schema
from app.models.user import User
from tests.graphql.mock_test_data import (
    MOCK_INFO1_CAMEL,
    MOCK_INFO3_CAMEL,
)
from app.services.implementations.mock_email_service import MockEmailService
from copy import deepcopy


def test_update_user_by_id(user_setup, mocker):
    user_1, user_2, user_3 = user_setup

    mocker.patch(
        "firebase_admin.auth.update_user",
        return_value=None,
    )

    user_object = User.objects(id=user_1.id).first()
    initial_involved_meal_requests = 5
    user_object.info.involved_meal_requests = initial_involved_meal_requests
    user_object.save()

    update_to_user_4_info = graphql_schema.execute(
        f"""mutation testUpdateUserById {{
            updateUserByID (
                requestorId: "{str(user_3.id)}",
                id: "{str(user_1.id)}",
                userInfo: {{
                    email: "test4@organization.com",
                    organizationAddress: "170 University Ave W",
                    organizationName: "Test3 Org",
                    organizationDesc: "Testing 123",
                    role: "Admin",
                    primaryContact: {{
                        name: "Anon ymous",
                        phone: "13579",
                        email: "anon@gmail.com",
                    }},
                    initialOnsiteContacts: [],
                    active: false
                }}
            ) {{
                user {{
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
                }}
            }}
        }}"""
    )

    assert update_to_user_4_info.errors is None

    user_result4 = update_to_user_4_info.data["updateUserByID"]["user"]
    assert user_result4["id"] == str(user_1.id)
    MOCK_INFO4_CAMEL = deepcopy(MOCK_INFO3_CAMEL)
    MOCK_INFO4_CAMEL["email"] = "test4@organization.com"
    MOCK_INFO4_CAMEL["active"] = False

    db_user = User.objects(id=user_1.id).first()

    assert db_user.info.email == "test4@organization.com"
    assert db_user.info.organization_address == "170 University Ave W"

    # Check that involved_meal_requests is not changed since its backend driven 
    assert db_user.info.involved_meal_requests == initial_involved_meal_requests


    assert user_result4["info"] == MOCK_INFO4_CAMEL

    update_to_user_1_info = graphql_schema.execute(
        f"""mutation testUpdateUserById {{
            updateUserByID (
                requestorId: "{str(user_3.id)}",
                id: "{str(user_1.id)}",
                userInfo: {{
                    email: "test1@organization.com",
                    organizationAddress: "255 King St N",
                    organizationName: "Test1 Org",
                    organizationDesc: "Testing123",
                    role: "ASP",
                    roleInfo: {{
                       aspInfo: {{
                         numKids: 4,
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
                user {{
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
                }}
            }}
        }}"""
    )

    user_result1 = update_to_user_1_info.data["updateUserByID"]["user"]
    assert user_result1["id"] == str(user_1.id)
    MOCK_INFO1_CAMEL["email"] = "test1@organization.com"
    assert user_result1["info"] == MOCK_INFO1_CAMEL


def test_number_of_kids_cant_be_set_negative(user_setup, mocker):
    user_1, _, user_3 = user_setup

    mocker.patch(
        "firebase_admin.auth.update_user",
        return_value=None,
    )

    update_num_kids_to_negative_mutation = graphql_schema.execute(
        f"""mutation testUpdateUserById {{
            updateUserByID (
                requestorId: "{str(user_3.id)}",
                id: "{str(user_1.id)}",
                userInfo: {{
                    email: "test1@organization.com",
                    organizationAddress: "255 King St N",
                    organizationName: "Test1 Org",
                    organizationDesc: "Testing123",
                    role: "ASP",
                    roleInfo: {{
                       aspInfo: {{
                         numKids: -10,
                       }},
                        donorInfo: null,
                    }},
                    primaryContact: {{
                        name: "Jessie",
                        phone: "123456",
                        email: "jessie123@gmail.com"
                    }},
                    initialOnsiteContacts: [
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
                user {{
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
                }}
            }}
        }}"""
    )

    # Check that there was an error
    assert len(update_num_kids_to_negative_mutation.errors) == 1
    error = str(update_num_kids_to_negative_mutation.errors[0])

    # Check error message is appropriate
    assert "num_kids must be greater than or equal to zero" in error


def test_activate_user_by_id(user_setup, mocker):
    _, _, user_3 = user_setup

    activate_user = graphql_schema.execute(
        f"""mutation testActivateUserById {{
            activateUserByID (
                requestorId: "{str(user_3.id)}",
                id: "{str(user_3.id)}"
            ) {{
                user {{
                    id
                    info {{
                        email
                        organizationAddress
                        organizationName
                        organizationDesc
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
                }}
            }}
        }}"""
    )

    assert activate_user.data["activateUserByID"]["user"]["info"]["active"] is True


def test_deactivate_user_by_id(user_setup, mocker):
    user_1, user_2, user_3 = user_setup

    deactivate_user = graphql_schema.execute(
        f"""mutation testDeactivateUserById {{
            deactivateUserByID (
                requestorId: "{str(user_1.id)}",
                id: "{str(user_1.id)}"
            ) {{
                user {{
                    id
                    info {{
                        email
                        organizationAddress
                        organizationName
                        organizationDesc
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
                }}
            }}
        }}"""
    )

    assert deactivate_user.data["deactivateUserByID"]["user"]["info"]["active"] is False

    deactivate_user = graphql_schema.execute(
        f"""mutation testDeactivateUserById {{
            deactivateUserByID (
                requestorId: "{str(user_3.id)}",
                id: "{str(user_3.id)}"
            ) {{
                user {{
                    id
                    info {{
                        email
                        organizationAddress
                        organizationName
                        organizationDesc
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
                }}
            }}
        }}"""
    )

    assert deactivate_user.data["deactivateUserByID"]["user"]["info"]["active"] is False

    # necessary to prevent further tests from failing
    graphql_schema.execute(
        f"""mutation testActivateUserById {{
            activateUserByID (
                requestorId: "{str(user_3.id)}",
                id: "{str(user_1.id)}"
            ) {{
                user {{
                    id
                    info {{
                        email
                        organizationAddress
                        organizationName
                        organizationDesc
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
                }}
            }}
        }}"""
    )


class FirebaseReturnValueMock:
    def __init__(self, auth_id):
        self.uid = auth_id


def test_reset_password(user_setup, mocker):
    user_1, user_2, user_3 = user_setup
    firebase_return_mock = FirebaseReturnValueMock(user_2.auth_id)

    mocker.patch(
        "firebase_admin.auth.get_user_by_email",
        return_value=firebase_return_mock,
    )

    reset_password = graphql_schema.execute(
        f"""mutation ForgotPassword {{
            forgotPassword (
                email: "{str(user_2.info.email)}"
            ) {{
                success
            }}
        }}"""
    )
    assert reset_password.errors is None

    email_service = MockEmailService.instance
    assert email_service is not None
    last_email = email_service.get_last_email_sent()
    assert last_email is not None
    assert last_email["subject"] == "FCK Reset Password Link"
    assert last_email["to"] == user_2.info.email
    assert "We have received your reset password request." in last_email["body"]
    assert (
        last_email["from_"]
        == "Feeding Canadian Kids <feedingcanadiankids@uwblueprint.org>"
    )
