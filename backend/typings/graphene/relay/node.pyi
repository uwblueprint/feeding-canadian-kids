from ..types import (
    Field as Field,
    ID as ID,
    Interface as Interface,
    ObjectType as ObjectType,
)
from ..types.interface import InterfaceOptions as InterfaceOptions
from ..types.utils import get_type as get_type
from _typeshed import Incomplete

def is_node(objecttype): ...

class GlobalID(Field):
    node: Incomplete
    parent_type_name: Incomplete
    def __init__(
        self,
        node: Incomplete | None = None,
        parent_type: Incomplete | None = None,
        required: bool = True,
        *args,
        **kwargs
    ) -> None: ...
    @staticmethod
    def id_resolver(
        parent_resolver,
        node,
        root,
        info,
        parent_type_name: Incomplete | None = None,
        **args
    ): ...
    def wrap_resolve(self, parent_resolver): ...

class NodeField(Field):
    node_type: Incomplete
    field_type: Incomplete
    def __init__(self, node, type_: bool = False, **kwargs) -> None: ...
    def wrap_resolve(self, parent_resolver): ...

class AbstractNode(Interface):
    class Meta:
        abstract: bool
    @classmethod
    def __init_subclass_with_meta__(cls, **options) -> None: ...

class Node(AbstractNode):
    @classmethod
    def Field(cls, *args, **kwargs): ...
    @classmethod
    def node_resolver(cls, only_type, root, info, id): ...
    @classmethod
    def get_node_from_global_id(
        cls, info, global_id, only_type: Incomplete | None = None
    ): ...
    @classmethod
    def from_global_id(cls, global_id): ...
    @classmethod
    def to_global_id(cls, type_, id): ...
