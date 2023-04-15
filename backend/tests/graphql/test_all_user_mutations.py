from app.graphql import schema as graphql_schema
from tests.graphql.mock_test_data import (
    MOCK_INFO1_CAMEL,
    MOCK_INFO3_CAMEL,
)
from copy import deepcopy


def test_update_user_by_id(user_setup, mocker):
    user_1, user_2, user_3 = user_setup

    mocker.patch(
        "firebase_admin.auth.update_user",
        return_value=None,
    )

    update_to_user_4_info = graphql_schema.execute(
        f"""mutation testUpdateUserById {{
            updateUserByID (
                requestorAuthId: "{str(user_3.auth_id)}",
                authId: "{str(user_3.auth_id)}",
                id: "{str(user_1.id)}",
                userInfo: {{
                    email: "test4@organization.com",
                    organizationAddress: "789 Anywhere Street",
                    organizationName: "Test3 Org",
                    role: "Admin",
                    primaryContact: {{
                        name: "Anon ymous",
                        phone: "13579",
                        email: "anon@gmail.com",
                    }},
                    onsiteContacts: [
                        {{
                            name: "ghi",
                            phone: "135-792-4680",
                            email: "ghi@uwblueprint.org"
                        }},
                        {{
                            name: "Jack Doe",
                            phone: "777-888-999",
                            email: "com@domain.email"
                        }},
                    ],
                }}
            ) {{
                user {{
                    id
                    info {{
                        email
                        organizationAddress
                        organizationName
                        role
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
                    }}
                }}
            }}
        }}"""
    )

    user_result4 = update_to_user_4_info.data["updateUserByID"]["user"]
    assert user_result4["id"] == str(user_1.id)
    MOCK_INFO4_CAMEL = deepcopy(MOCK_INFO3_CAMEL)
    MOCK_INFO4_CAMEL["email"] = "test4@organization.com"
    assert user_result4["info"] == MOCK_INFO4_CAMEL

    update_to_user_1_info = graphql_schema.execute(
        f"""mutation testUpdateUserById {{
            updateUserByID (
                requestorAuthId: "{str(user_3.auth_id)}",
                authId: "{str(user_1.auth_id)}",
                id: "{str(user_1.id)}",
                userInfo: {{
                    email: "test1@organization.com",
                    organizationAddress: "123 Anywhere Street",
                    organizationName: "Test1 Org",
                    role: "ASP",
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
                    ]
                }}
            ) {{
                user {{
                    id
                    info {{
                        email
                        organizationAddress
                        organizationName
                        role
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
                    }}
                }}
            }}
        }}"""
    )

    user_result1 = update_to_user_1_info.data["updateUserByID"]["user"]
    assert user_result1["id"] == str(user_1.id)
    assert user_result1["info"] == MOCK_INFO1_CAMEL
