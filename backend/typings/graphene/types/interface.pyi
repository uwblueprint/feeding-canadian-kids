from .base import BaseOptions as BaseOptions, BaseType as BaseType
from .field import Field as Field
from .utils import yank_fields_from_attrs as yank_fields_from_attrs
from _typeshed import Incomplete
from typing import Dict, Iterable, Type

MYPY: bool

class InterfaceOptions(BaseOptions):
    fields: Dict[str, Field]
    interfaces: Iterable[Type[Interface]]

class Interface(BaseType):
    @classmethod
    def __init_subclass_with_meta__(
        cls, _meta: Incomplete | None = None, interfaces=(), **options
    ) -> None: ...
    @classmethod
    def resolve_type(cls, instance, info): ...
    def __init__(self, *args, **kwargs) -> None: ...
