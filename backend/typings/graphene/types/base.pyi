from ..utils.subclass_with_meta import (
    SubclassWithMeta as SubclassWithMeta,
    SubclassWithMeta_Meta as SubclassWithMeta_Meta,
)
from ..utils.trim_docstring import trim_docstring as trim_docstring
from _typeshed import Incomplete

class BaseOptions:
    name: str
    description: str
    class_type: Incomplete
    def __init__(self, class_type) -> None: ...
    def freeze(self) -> None: ...
    def __setattr__(self, name, value) -> None: ...

BaseTypeMeta = SubclassWithMeta_Meta

class BaseType(SubclassWithMeta):
    @classmethod
    def create_type(cls, class_name, **options): ...
    @classmethod
    def __init_subclass_with_meta__(
        cls,
        name: Incomplete | None = None,
        description: Incomplete | None = None,
        _meta: Incomplete | None = None,
        **_kwargs
    ) -> None: ...
