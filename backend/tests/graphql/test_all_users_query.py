from app.graphql.all_users import UserQueries
import graphene
from graphene.test import Client
from app.resources.user_dto import UserDTO


def test_all_users(mocker):
    mock_result = [
        UserDTO("1", "John", "Doe", "JohnDoe@email.com", "Admin"),
        UserDTO("2", "Jane", "Doe", "JaneDoe@email.com", "ASP"),
    ]

    mocker.patch(
        "app.services.implementations.user_service.UserService.get_users",
        return_value=mock_result,
    )

    schema = graphene.Schema(query=UserQueries)
    client = Client(schema)
    executed = client.execute(
        """{
        users {
            firstName
            lastName
            email
            role
        }}"""
    )

    expected_result = {
        "data": {
            "users": [
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "JohnDoe@email.com",
                    "role": "Admin",
                },
                {
                    "firstName": "Jane",
                    "lastName": "Doe",
                    "email": "JaneDoe@email.com",
                    "role": "ASP",
                },
            ]
        }
    }

    assert executed == expected_result


def test_all_users_filter(mocker):
    mock_result = [
        UserDTO("1", "John", "Doe", "JohnDoe@email.com", "Admin"),
        UserDTO("2", "Jane", "Doe", "JaneDoe@email.com", "ASP"),
    ]

    mocker.patch(
        "app.services.implementations.user_service.UserService.get_users",
        return_value=mock_result,
    )

    schema = graphene.Schema(query=UserQueries)
    client = Client(schema)
    executed = client.execute(
        """{
        users(role: "Admin") {
            firstName
            lastName
            email
            role
        }}"""
    )

    expected_result = {
        "data": {
            "users": [
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "JohnDoe@email.com",
                    "role": "Admin",
                },
            ]
        }
    }

    assert executed == expected_result
