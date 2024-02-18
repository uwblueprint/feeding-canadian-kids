from ..utils.is_introspection_key import is_introspection_key as is_introspection_key
from graphql.language import FieldNode as FieldNode
from graphql.validation import ValidationRule

class DisableIntrospection(ValidationRule):
    def enter_field(self, node: FieldNode, *_args): ...
