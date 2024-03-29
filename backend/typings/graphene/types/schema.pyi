from ..utils.get_unbound_function import get_unbound_function as get_unbound_function
from ..utils.str_converters import to_camel_case as to_camel_case
from .definitions import (
    GrapheneEnumType as GrapheneEnumType,
    GrapheneGraphQLType as GrapheneGraphQLType,
    GrapheneInputObjectType as GrapheneInputObjectType,
    GrapheneInterfaceType as GrapheneInterfaceType,
    GrapheneObjectType as GrapheneObjectType,
    GrapheneScalarType as GrapheneScalarType,
    GrapheneUnionType as GrapheneUnionType,
)
from .dynamic import Dynamic as Dynamic
from .enum import Enum as Enum
from .field import Field as Field
from .inputobjecttype import InputObjectType as InputObjectType
from .interface import Interface as Interface
from .objecttype import ObjectType as ObjectType
from .resolver import get_default_resolver as get_default_resolver
from .scalars import (
    Boolean as Boolean,
    Float as Float,
    ID as ID,
    Int as Int,
    Scalar as Scalar,
    String as String,
)
from .structures import List as List, NonNull as NonNull
from .union import Union as Union
from .utils import get_field_as as get_field_as
from _typeshed import Incomplete

introspection_query: Incomplete
IntrospectionSchema: Incomplete

def assert_valid_root_type(type_) -> None: ...
def is_graphene_type(type_): ...
def is_type_of_from_possible_types(possible_types, root, _info): ...
def identity_resolve(root, info, **arguments): ...

class TypeMap(dict):
    auto_camelcase: Incomplete
    query: Incomplete
    mutation: Incomplete
    subscription: Incomplete
    types: Incomplete
    def __init__(
        self,
        query: Incomplete | None = None,
        mutation: Incomplete | None = None,
        subscription: Incomplete | None = None,
        types: Incomplete | None = None,
        auto_camelcase: bool = True,
    ) -> None: ...
    def add_type(self, graphene_type): ...
    @staticmethod
    def create_scalar(graphene_type): ...
    @staticmethod
    def create_enum(graphene_type): ...
    def create_objecttype(self, graphene_type): ...
    def create_interface(self, graphene_type): ...
    def create_inputobjecttype(self, graphene_type): ...
    def construct_union(self, graphene_type): ...
    def get_name(self, name): ...
    def create_fields_for_type(self, graphene_type, is_input_type: bool = False): ...
    def get_function_for_type(self, graphene_type, func_name, name, default_value): ...
    def resolve_type(self, resolve_type_func, type_name, root, info, _type): ...

class Schema:
    query: Incomplete
    mutation: Incomplete
    subscription: Incomplete
    graphql_schema: Incomplete
    def __init__(
        self,
        query: Incomplete | None = None,
        mutation: Incomplete | None = None,
        subscription: Incomplete | None = None,
        types: Incomplete | None = None,
        directives: Incomplete | None = None,
        auto_camelcase: bool = True,
    ) -> None: ...
    def __getattr__(self, type_name): ...
    def lazy(self, _type): ...
    def execute(self, *args, **kwargs): ...
    async def execute_async(self, *args, **kwargs): ...
    async def subscribe(self, query, *args, **kwargs): ...
    def introspect(self): ...

def normalize_execute_kwargs(kwargs): ...
