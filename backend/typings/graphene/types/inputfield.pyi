from .mountedtype import MountedType as MountedType
from .structures import NonNull as NonNull
from .utils import get_type as get_type
from _typeshed import Incomplete

class InputField(MountedType):
    name: Incomplete
    deprecation_reason: Incomplete
    default_value: Incomplete
    description: Incomplete
    def __init__(
        self,
        type_,
        name: Incomplete | None = None,
        default_value=...,
        deprecation_reason: Incomplete | None = None,
        description: Incomplete | None = None,
        required: bool = False,
        _creation_counter: Incomplete | None = None,
        **extra_args
    ) -> None: ...
    @property
    def type(self): ...
