from .mountedtype import MountedType as MountedType
from _typeshed import Incomplete

class Dynamic(MountedType):
    type: Incomplete
    with_schema: Incomplete
    def __init__(
        self,
        type_,
        with_schema: bool = False,
        _creation_counter: Incomplete | None = None,
    ) -> None: ...
    def get_type(self, schema: Incomplete | None = None): ...
