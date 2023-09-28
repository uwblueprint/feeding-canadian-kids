from app.graphql import schema as graphql_schema
from tests.graphql.mock_test_data import (
    MOCK_INFO1_CAMEL,
    MOCK_INFO2_CAMEL,
    MOCK_INFO3_CAMEL,
)


def test_all_users(user_setup):
    user_1, user_2, user_3 = user_setup
    executed = graphql_schema.execute(
        """{
            getAllUsers {
                id
                info {
                    email
                    organizationAddress
                    organizationName
                    organizationDesc
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
            }
        }"""
    )

    assert len(executed.data["getAllUsers"]) == 3
    print(executed.data["getAllUsers"])
    user_result1 = executed.data["getAllUsers"][0]
    assert user_result1["id"] == str(user_1.id)
    assert user_result1["info"] == MOCK_INFO1_CAMEL
    user_result2 = executed.data["getAllUsers"][1]
    assert user_result2["id"] == str(user_2.id)
    assert user_result2["info"] == MOCK_INFO2_CAMEL
    user_result3 = executed.data["getAllUsers"][2]
    assert user_result3["id"] == str(user_3.id)
    assert user_result3["info"] == MOCK_INFO3_CAMEL


def test_all_users_filter_by_role(user_setup):
    user_1, user_2, user_3 = user_setup
    executed = graphql_schema.execute(
        """{
        getAllUsers(role: "Admin") {
            id
            info {
                email
                organizationAddress
                organizationName
                organizationDesc
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
        }}"""
    )

    assert len(executed.data["getAllUsers"]) == 1
    user_result = executed.data["getAllUsers"][0]
    assert user_result["id"] == str(user_3.id)
    assert user_result["info"] == MOCK_INFO3_CAMEL


def test_get_user_by_id(user_setup):
    user_1, user_2, user_3 = user_setup
    executed = graphql_schema.execute(
        f"""{{
            getUserById(id: "{str(user_2.id)}") {{
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
                    onsiteContacts {{
                        name
                        phone
                        email
                    }}
                    active
                }}
            }}
        }}"""
    )
    user_result = executed.data["getUserById"]
    assert user_result["id"] == str(user_2.id)
    assert user_result["info"] == MOCK_INFO2_CAMEL
