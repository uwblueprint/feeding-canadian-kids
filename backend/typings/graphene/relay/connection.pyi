from ..types import (
    Boolean as Boolean,
    Enum as Enum,
    Int as Int,
    Interface as Interface,
    List as List,
    NonNull as NonNull,
    Scalar as Scalar,
    String as String,
    Union as Union,
)
from ..types.field import Field as Field
from ..types.objecttype import (
    ObjectType as ObjectType,
    ObjectTypeOptions as ObjectTypeOptions,
)
from ..utils.thenables import maybe_thenable as maybe_thenable
from .node import is_node as is_node
from _typeshed import Incomplete

class PageInfo(ObjectType):
    class Meta:
        description: str
    has_next_page: Incomplete
    has_previous_page: Incomplete
    start_cursor: Incomplete
    end_cursor: Incomplete

def page_info_adapter(startCursor, endCursor, hasPreviousPage, hasNextPage): ...

class ConnectionOptions(ObjectTypeOptions):
    node: Incomplete

class Connection(ObjectType):
    class Meta:
        abstract: bool
    @classmethod
    def __init_subclass_with_meta__(
        cls, node: Incomplete | None = None, name: Incomplete | None = None, **options
    ): ...

def connection_adapter(cls, edges, pageInfo): ...

class IterableConnectionField(Field):
    def __init__(self, type_, *args, **kwargs) -> None: ...
    @property
    def type(self): ...
    @classmethod
    def resolve_connection(cls, connection_type, args, resolved): ...
    @classmethod
    def connection_resolver(cls, resolver, connection_type, root, info, **args): ...
    def wrap_resolve(self, parent_resolver): ...

ConnectionField = IterableConnectionField
