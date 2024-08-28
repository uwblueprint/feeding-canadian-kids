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
            }
        }"""
    )

    assert len(executed.data["getAllUsers"]) == 3
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
        }}"""
    )

    assert len(executed.data["getAllUsers"]) == 1
    user_result = executed.data["getAllUsers"][0]
    assert user_result["id"] == str(user_3.id)
    assert user_result["info"] == MOCK_INFO3_CAMEL


def test_all_users_filter_by_name(user_setup):
    user_1, user_2, user_3 = user_setup
    executed = graphql_schema.execute(
        """{
        getAllUsers(name: "Test3") {
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
        }}"""
    )
    user_result = executed.data["getUserById"]
    assert user_result["id"] == str(user_2.id)
    assert user_result["info"] == MOCK_INFO2_CAMEL


# Note: mongomock does not currently support $geoNear queries, so cannot test
# https://github.com/mongomock/mongomock/blob/develop/Missing_Features.rst
# def test_get_asp_near_location(user_setup):
#     user_1, user_2, user_3 = user_setup
#     executed = graphql_schema.execute(
#         f"""{{
#             getASPNearLocation(requestorId: "{str(user_2.id)}", maxDistance: 100) {{
#                 id
#                 info {{
#                     email
#                     organizationAddress
#                     organizationName
#                     organizationDesc
#                     organizationCoordinates
#                     role
#                     roleInfo {{
#                         aspInfo {{
#                             numKids
#                         }}
#                         donorInfo {{
#                             type
#                             tags
#                         }}
#                     }}
#                     primaryContact {{
#                         name
#                         phone
#                         email
#                     }}
#                     initialOnsiteContacts {{
#                         name
#                         phone
#                         email
#                     }}
#                     active
#                 }}
#                 distance
#             }}
#         }}"""
#     )

#     asp_result = executed.data["getASPNearLocation"][0]
#     assert asp_result["id"] == str(user_1.id)
#     assert asp_result["info"] == MOCK_INFO1_CAMEL
#     assert asp_result["distance"] <= 100
