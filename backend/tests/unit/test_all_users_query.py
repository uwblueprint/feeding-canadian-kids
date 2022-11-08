from app.graphql.all_users import AllUsersQuery
import graphene
from graphene.test import Client


def test_all_users(mocker):
    mock_result = [
        {
            "id": "1",
            "first_name": "John",
            "last_name": "Doe",
            "email": "JohnDoe@email.com",
            "role": "Admin",
        },
        {
            "id": "2",
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "JaneDoe@email.com",
            "role": "ASP",
        },
    ]
    mocker.patch(
        "app.services.implementations.user_service.UserService.get_users",
        return_value=mock_result,
    )

    schema = graphene.Schema(query=AllUsersQuery)
    client = Client(schema)
    executed = client.execute(
        """{
        allUsers {
            name
            email
            role
        }}"""
    )

    expected_result = {
        "data": {
            "allUsers": [
                {"name": "John Doe", "email": "JohnDoe@email.com", "role": "Admin"},
                {"name": "Jane Doe", "email": "JaneDoe@email.com", "role": "ASP"},
            ]
        }
    }

    assert executed == expected_result
