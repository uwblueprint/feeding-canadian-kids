from ..utils.module_loading import import_string as import_string
from .mountedtype import MountedType as MountedType
from .unmountedtype import UnmountedType as UnmountedType
from _typeshed import Incomplete

def get_field_as(value, _as: Incomplete | None = None): ...
def yank_fields_from_attrs(attrs, _as: Incomplete | None = None, sort: bool = True): ...
def get_type(_type): ...
def get_underlying_type(_type): ...
