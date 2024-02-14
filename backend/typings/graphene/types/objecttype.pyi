from ..pyutils.dataclasses import field as field, make_dataclass as make_dataclass
from .base import (
    BaseOptions as BaseOptions,
    BaseType as BaseType,
    BaseTypeMeta as BaseTypeMeta,
)
from .field import Field as Field
from .interface import Interface as Interface
from .utils import yank_fields_from_attrs as yank_fields_from_attrs
from _typeshed import Incomplete
from typing import Dict, Iterable, Type

MYPY: bool

class ObjectTypeOptions(BaseOptions):
    fields: Dict[str, Field]
    interfaces: Iterable[Type[Interface]]

class ObjectTypeMeta(BaseTypeMeta):
    def __new__(cls, name_, bases, namespace, **options): ...

class ObjectType(BaseType, metaclass=ObjectTypeMeta):
    @classmethod
    def __init_subclass_with_meta__(
        cls,
        interfaces=(),
        possible_types=(),
        default_resolver: Incomplete | None = None,
        _meta: Incomplete | None = None,
        **options
    ) -> None: ...
    is_type_of: Incomplete
