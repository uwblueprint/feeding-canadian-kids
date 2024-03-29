from _typeshed import Incomplete

__all__ = [
    "dataclass",
    "field",
    "Field",
    "FrozenInstanceError",
    "InitVar",
    "MISSING",
    "fields",
    "asdict",
    "astuple",
    "make_dataclass",
    "replace",
    "is_dataclass",
]

class FrozenInstanceError(AttributeError): ...
class _HAS_DEFAULT_FACTORY_CLASS: ...
class _MISSING_TYPE: ...

MISSING: Incomplete

class _FIELD_BASE:
    name: Incomplete
    def __init__(self, name) -> None: ...

class _InitVarMeta(type):
    def __getitem__(self, params): ...

class InitVar(metaclass=_InitVarMeta): ...

class Field:
    name: Incomplete
    type: Incomplete
    default: Incomplete
    default_factory: Incomplete
    init: Incomplete
    repr: Incomplete
    hash: Incomplete
    compare: Incomplete
    metadata: Incomplete
    def __init__(
        self, default, default_factory, init, repr, hash, compare, metadata
    ) -> None: ...
    def __set_name__(self, owner, name) -> None: ...

class _DataclassParams:
    init: Incomplete
    repr: Incomplete
    eq: Incomplete
    order: Incomplete
    unsafe_hash: Incomplete
    frozen: Incomplete
    def __init__(self, init, repr, eq, order, unsafe_hash, frozen) -> None: ...

def field(
    *,
    default=...,
    default_factory=...,
    init: bool = True,
    repr: bool = True,
    hash: Incomplete | None = None,
    compare: bool = True,
    metadata: Incomplete | None = None
): ...
def dataclass(
    _cls: Incomplete | None = None,
    *,
    init: bool = True,
    repr: bool = True,
    eq: bool = True,
    order: bool = False,
    unsafe_hash: bool = False,
    frozen: bool = False
): ...
def fields(class_or_instance): ...
def is_dataclass(obj): ...
def asdict(obj, *, dict_factory=...): ...
def astuple(obj, *, tuple_factory=...): ...
def make_dataclass(
    cls_name,
    fields,
    *,
    bases=(),
    namespace: Incomplete | None = None,
    init: bool = True,
    repr: bool = True,
    eq: bool = True,
    order: bool = False,
    unsafe_hash: bool = False,
    frozen: bool = False
): ...
def replace(obj, **changes): ...
