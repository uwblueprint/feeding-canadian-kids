import pytest


@pytest.fixture(scope="session", autouse=True)
def graphql_schema():
    """
    Returns graphene client for test query/mutation
    """
    from app.graphql import schema as graphql_schema

    yield graphql_schema
