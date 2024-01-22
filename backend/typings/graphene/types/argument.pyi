from .dynamic import Dynamic as Dynamic
from .mountedtype import MountedType as MountedType
from .structures import NonNull as NonNull
from .utils import get_type as get_type
from _typeshed import Incomplete

class Argument(MountedType):
    name: Incomplete
    default_value: Incomplete
    description: Incomplete
    def __init__(self, type_, default_value=..., description: Incomplete | None = None, name: Incomplete | None = None, required: bool = False, _creation_counter: Incomplete | None = None) -> None: ...
    @property
    def type(self): ...
    def __eq__(self, other): ...

def to_arguments(args, extra_args: Incomplete | None = None): ...
