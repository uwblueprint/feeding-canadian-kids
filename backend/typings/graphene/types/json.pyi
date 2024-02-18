from .scalars import Scalar as Scalar
from _typeshed import Incomplete

class JSONString(Scalar):
    @staticmethod
    def serialize(dt): ...
    @staticmethod
    def parse_literal(node, _variables: Incomplete | None = None): ...
    @staticmethod
    def parse_value(value): ...
