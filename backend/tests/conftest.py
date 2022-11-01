import pytest
from app import create_app


@pytest.fixture(scope="session", autouse=True)
def app():
    """
    Setup and returns app configured for testing
    """
    yield create_app("testing")
