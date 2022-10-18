from app.graphql.all_users import AllUsersQuery
import graphene
from graphene.test import Client
from app.resources.user_dto import UserDTO


def test_all_users(mocker):
    mock_result = [UserDTO('1', 'John', 'Doe', 'JohnDoe@email.com', 'Admin'), UserDTO('2', 'Jane', 'Doe', 'JaneDoe@email.com', 'ASP')]

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
