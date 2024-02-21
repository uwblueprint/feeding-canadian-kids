from ..utils.deprecated import warn_deprecation as warn_deprecation
from .argument import Argument as Argument, to_arguments as to_arguments
from .mountedtype import MountedType as MountedType
from .resolver import default_resolver as default_resolver
from .structures import NonNull as NonNull
from .unmountedtype import UnmountedType as UnmountedType
from .utils import get_type as get_type
from _typeshed import Incomplete

base_type = type

def source_resolver(source, root, info, **args): ...

class Field(MountedType):
    name: Incomplete
    args: Incomplete
    resolver: Incomplete
    deprecation_reason: Incomplete
    description: Incomplete
    default_value: Incomplete
    def __init__(
        self,
        type_,
        args: Incomplete | None = None,
        resolver: Incomplete | None = None,
        source: Incomplete | None = None,
        deprecation_reason: Incomplete | None = None,
        name: Incomplete | None = None,
        description: Incomplete | None = None,
        required: bool = False,
        _creation_counter: Incomplete | None = None,
        default_value: Incomplete | None = None,
        **extra_args
    ) -> None: ...
    @property
    def type(self): ...
    get_resolver: Incomplete
    def wrap_resolve(self, parent_resolver): ...
    def wrap_subscribe(self, parent_subscribe): ...
