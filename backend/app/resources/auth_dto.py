from .token import Token
from .user_dto import UserDTO


class AuthDTO(Token, UserDTO):
    def __init__(self, access_token, refresh_token, id, info):
        Token.__init__(self, access_token, refresh_token)
        UserDTO.__init__(self, id, info)
