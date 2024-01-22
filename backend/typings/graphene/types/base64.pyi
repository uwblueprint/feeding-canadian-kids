from .scalars import Scalar as Scalar
from _typeshed import Incomplete

class Base64(Scalar):
    @staticmethod
    def serialize(value): ...
    @classmethod
    def parse_literal(cls, node, _variables: Incomplete | None = None): ...
    @staticmethod
    def parse_value(value): ...
