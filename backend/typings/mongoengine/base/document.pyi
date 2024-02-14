from _typeshed import Incomplete

__all__ = ["BaseDocument", "NON_FIELD_ERRORS"]

NON_FIELD_ERRORS: str

class BaseDocument:
    STRICT: bool
    def __init__(self, *args, **values) -> None: ...
    def __delattr__(self, *args, **kwargs) -> None: ...
    def __setattr__(self, name, value) -> None: ...
    def __iter__(self): ...
    def __getitem__(self, name): ...
    def __setitem__(self, name, value) -> None: ...
    def __contains__(self, name) -> bool: ...
    def __len__(self) -> int: ...
    def __eq__(self, other): ...
    def __ne__(self, other): ...
    def clean(self) -> None: ...
    def get_text_score(self): ...
    def to_mongo(self, use_db_field: bool = True, fields: Incomplete | None = None): ...
    def validate(self, clean: bool = True) -> None: ...
    def to_json(self, *args, **kwargs): ...
    @classmethod
    def from_json(cls, json_data, created: bool = False, **kwargs): ...
