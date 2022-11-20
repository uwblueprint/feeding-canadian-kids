from flask import current_app
import pytest

from app.models.user import User
from app.services.implementations.user_service import UserService

@pytest.fixture(scope="module", autouse=True)
def setup(module_mocker):
    module_mocker.patch(
        "app.services.implementations.auth_service.AuthService.is_authorized_by_role",
        return_value=True,
    )
    module_mocker.patch("firebase_admin.auth.get_user", return_value=FirebaseUser())