from .base import BaseOptions as BaseOptions, BaseType as BaseType
from .objecttype import ObjectType as ObjectType
from .unmountedtype import UnmountedType as UnmountedType
from _typeshed import Incomplete
from typing import Iterable, Type

MYPY: bool

class UnionOptions(BaseOptions):
    types: Iterable[Type[ObjectType]]

class Union(UnmountedType, BaseType):
    @classmethod
    def __init_subclass_with_meta__(cls, types: Incomplete | None = None, **options) -> None: ...
    @classmethod
    def get_type(cls): ...
    @classmethod
    def resolve_type(cls, instance, info): ...
