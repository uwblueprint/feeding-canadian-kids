from app.graphql.user import UserQuery
import graphene
from graphene.test import Client
from app.resources.user_dto import UserDTO


def test_all_users(mocker):
    mock_result = UserDTO('1', 'John', 'Doe', 'JohnDoe@email.com', 'Admin')
    mocker.patch(
        "app.services.implementations.user_service.UserService.get_user_by_id",
        return_value=mock_result,
    )

    schema = graphene.Schema(query=UserQuery)
    client = Client(schema)
    executed = client.execute(
        """{
        user(id:"1") {
            name
            email
            role
        }}"""
    )

    expected_result = {
        "data": {
            "user": {"name": "John Doe", "email": "JohnDoe@email.com", "role": "Admin"}
            
        }
    }

    assert executed == expected_result
