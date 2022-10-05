from flask import current_app, jsonify, request
from functools import wraps

from ..services.implementations.auth_service import AuthService
from ..services.implementations.user_service import UserService

user_service = UserService(current_app.logger)
auth_service = AuthService(current_app.logger, user_service)

cookie_options = {
    "httponly": True,
    "samesite": ("None" if os.getenv("PREVIEW_DEPLOY") else "Strict"),
    "secure": (os.getenv("FLASK_CONFIG") == "production"),
}

def get_access_token(request):
    auth_header = request.headers.get("Authorization")
    if auth_header:
        auth_header_parts = auth_header.split(" ")
        if len(auth_header_parts) >= 2 and auth_header_parts[0].lower() == "bearer":
            return auth_header_parts[1]
    return None

class CookieConfigMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if code := getattr(request, "set_cookie", None):
            response.set_cookie("refreshToken",
            value=auth_dto.refresh_token,
            **cookie_options,)

        return response