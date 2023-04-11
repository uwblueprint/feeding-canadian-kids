from app.graphql import schema as graphql_schema
from app.resources.user_dto import UserDTO
from tests.graphql.mock_test_data import (
    MOCK_USER1,
    MOCK_USER2,
    MOCK_INFO1_CAMEL,
    MOCK_INFO2_CAMEL,
)


def convert_to_user_dtos(mock_result):
    mock_result_dtos = []
    for user_dict in mock_result:
        kwargs = {
            "id": user_dict["id"],
            "info": user_dict["info"],
        }
        mock_result_dtos.append(UserDTO(**kwargs))
    return mock_result_dtos


def test_all_users(mocker):
    mock_result = [
        MOCK_USER1.to_serializable_dict(),
        MOCK_USER2.to_serializable_dict(),
    ]

    mock_result_dtos = convert_to_user_dtos(mock_result)

    mocker.patch(
        "app.services.implementations.user_service.UserService.get_users",
        return_value=mock_result_dtos,
    )

    executed = graphql_schema.execute(
        """{
        getAllUsers {
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
        }}"""
    )

    user_result1 = executed.data["getAllUsers"][0]
    assert user_result1["info"] == MOCK_INFO1_CAMEL
    user_result2 = executed.data["getAllUsers"][1]
    assert user_result2["info"] == MOCK_INFO2_CAMEL


def test_all_users_filter_by_role(mocker):
    mock_result = [
        MOCK_USER1.to_serializable_dict(),
        MOCK_USER2.to_serializable_dict(),
    ]

    mock_result_dtos = convert_to_user_dtos(mock_result)

    mocker.patch(
        "app.services.implementations.user_service.UserService.get_users",
        return_value=mock_result_dtos,
    )

    executed = graphql_schema.execute(
        """{
        getAllUsers(role: "Donor") {
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
        }}"""
    )

    user_result2 = executed.data["getAllUsers"][0]
    assert user_result2["info"] == MOCK_INFO2_CAMEL


def test_user_by_id(mocker):
    mock_result = [MOCK_USER1.to_serializable_dict()]
    mock_result[0]["id"] = "1"

    mock_result_dtos = convert_to_user_dtos(mock_result)

    mocker.patch(
        "app.services.implementations.user_service.UserService.get_user_by_id",
        return_value=mock_result_dtos[0],
    )

    executed = graphql_schema.execute(
        """{
        getUserById(id: "1") {
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
        }}"""
    )

    user_result1 = executed.data["getUserById"]
    assert user_result1["info"] == MOCK_INFO1_CAMEL
