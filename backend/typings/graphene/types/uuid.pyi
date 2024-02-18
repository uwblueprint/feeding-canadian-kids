from .scalars import Scalar as Scalar
from _typeshed import Incomplete

class UUID(Scalar):
    @staticmethod
    def serialize(uuid): ...
    @staticmethod
    def parse_literal(node, _variables: Incomplete | None = None): ...
    @staticmethod
    def parse_value(value): ...
