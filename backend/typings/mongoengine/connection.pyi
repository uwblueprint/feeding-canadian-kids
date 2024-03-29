from _typeshed import Incomplete

__all__ = [
    "DEFAULT_CONNECTION_NAME",
    "DEFAULT_DATABASE_NAME",
    "ConnectionFailure",
    "connect",
    "disconnect",
    "disconnect_all",
    "get_connection",
    "get_db",
    "register_connection",
]

DEFAULT_CONNECTION_NAME: str
DEFAULT_DATABASE_NAME: str

class ConnectionFailure(Exception): ...

def register_connection(
    alias,
    db: Incomplete | None = None,
    name: Incomplete | None = None,
    host: Incomplete | None = None,
    port: Incomplete | None = None,
    read_preference=...,
    username: Incomplete | None = None,
    password: Incomplete | None = None,
    authentication_source: Incomplete | None = None,
    authentication_mechanism: Incomplete | None = None,
    authmechanismproperties: Incomplete | None = None,
    **kwargs
) -> None: ...
def disconnect(alias=...) -> None: ...
def disconnect_all() -> None: ...
def get_connection(alias=..., reconnect: bool = False): ...
def get_db(alias=..., reconnect: bool = False): ...
def connect(db: Incomplete | None = None, alias=..., **kwargs): ...
