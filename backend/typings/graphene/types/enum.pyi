from .base import BaseOptions as BaseOptions, BaseType as BaseType
from .unmountedtype import UnmountedType as UnmountedType
from _typeshed import Incomplete
from graphene.utils.subclass_with_meta import (
    SubclassWithMeta_Meta as SubclassWithMeta_Meta,
)

def eq_enum(self, other): ...

EnumType: Incomplete

class EnumOptions(BaseOptions):
    enum: Enum
    deprecation_reason: Incomplete

class EnumMeta(SubclassWithMeta_Meta):
    def __new__(cls, name_, bases, classdict, **options): ...
    def get(cls, value): ...
    def __getitem__(cls, value): ...
    def __prepare__(name, bases, **kwargs): ...
    def __call__(cls, *args, **kwargs): ...
    def from_enum(
        cls,
        enum,
        name: Incomplete | None = None,
        description: Incomplete | None = None,
        deprecation_reason: Incomplete | None = None,
    ): ...

class Enum(UnmountedType, BaseType, metaclass=EnumMeta):
    @classmethod
    def __init_subclass_with_meta__(
        cls, enum: Incomplete | None = None, _meta: Incomplete | None = None, **options
    ) -> None: ...
    @classmethod
    def get_type(cls): ...
