from _typeshed import Incomplete

__all__ = ["QueryFieldList"]

class QueryFieldList:
    ONLY: int
    EXCLUDE: int
    value: Incomplete
    fields: Incomplete
    always_include: Incomplete
    slice: Incomplete
    def __init__(
        self,
        fields: Incomplete | None = None,
        value=...,
        always_include: Incomplete | None = None,
        _only_called: bool = False,
    ) -> None: ...
    def __add__(self, f): ...
    def __bool__(self) -> bool: ...
    def as_dict(self): ...
    def reset(self) -> None: ...
