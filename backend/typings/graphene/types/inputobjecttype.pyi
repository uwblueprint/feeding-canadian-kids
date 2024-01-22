from .base import BaseOptions as BaseOptions, BaseType as BaseType
from .inputfield import InputField as InputField
from .unmountedtype import UnmountedType as UnmountedType
from .utils import yank_fields_from_attrs as yank_fields_from_attrs
from _typeshed import Incomplete
from typing import Dict

MYPY: bool

class InputObjectTypeOptions(BaseOptions):
    fields: Dict[str, InputField]
    container: InputObjectTypeContainer

class InputObjectTypeContainer(dict, BaseType):
    class Meta:
        abstract: bool
    def __init__(self, *args, **kwargs) -> None: ...
    def __init_subclass__(cls, *args, **kwargs) -> None: ...

class InputObjectType(UnmountedType, BaseType):
    @classmethod
    def __init_subclass_with_meta__(cls, container: Incomplete | None = None, _meta: Incomplete | None = None, **options) -> None: ...
    @classmethod
    def get_type(cls): ...
