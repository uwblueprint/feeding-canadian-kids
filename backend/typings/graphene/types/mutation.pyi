from ..utils.deprecated import warn_deprecation as warn_deprecation
from ..utils.get_unbound_function import get_unbound_function as get_unbound_function
from ..utils.props import props as props
from .argument import Argument as Argument
from .field import Field as Field
from .interface import Interface as Interface
from .objecttype import ObjectType as ObjectType, ObjectTypeOptions as ObjectTypeOptions
from .utils import yank_fields_from_attrs as yank_fields_from_attrs
from _typeshed import Incomplete
from typing import Callable, Dict, Iterable, Type

MYPY: bool

class MutationOptions(ObjectTypeOptions):
    arguments: Dict[str, Argument]
    output: Type[ObjectType]
    resolver: Callable
    interfaces: Iterable[Type[Interface]]

class Mutation(ObjectType):
    @classmethod
    def __init_subclass_with_meta__(
        cls,
        interfaces=(),
        resolver: Incomplete | None = None,
        output: Incomplete | None = None,
        arguments: Incomplete | None = None,
        _meta: Incomplete | None = None,
        **options
    ) -> None: ...
    @classmethod
    def Field(
        cls,
        name: Incomplete | None = None,
        description: Incomplete | None = None,
        deprecation_reason: Incomplete | None = None,
        required: bool = False,
    ): ...
