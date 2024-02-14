from ..utils.is_introspection_key import is_introspection_key as is_introspection_key
from graphql.language import (
    DefinitionNode as DefinitionNode,
    FieldNode,
    FragmentDefinitionNode,
    Node as Node,
    OperationDefinitionNode,
)
from graphql.validation import ValidationContext as ValidationContext
from typing import Callable, Dict, List, Optional, Pattern, Union

IgnoreType = Union[Callable[[str], bool], Pattern, str]

def depth_limit_validator(
    max_depth: int,
    ignore: Optional[List[IgnoreType]] = None,
    callback: Callable[[Dict[str, int]], None] = None,
): ...
def get_fragments(
    definitions: List[DefinitionNode],
) -> Dict[str, FragmentDefinitionNode]: ...
def get_queries_and_mutations(
    definitions: List[DefinitionNode],
) -> Dict[str, OperationDefinitionNode]: ...
def determine_depth(
    node: Node,
    fragments: Dict[str, FragmentDefinitionNode],
    depth_so_far: int,
    max_depth: int,
    context: ValidationContext,
    operation_name: str,
    ignore: Optional[List[IgnoreType]] = None,
) -> int: ...
def is_ignored(node: FieldNode, ignore: Optional[List[IgnoreType]] = None) -> bool: ...
