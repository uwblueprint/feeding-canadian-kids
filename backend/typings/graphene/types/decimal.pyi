from .scalars import Scalar as Scalar
from _typeshed import Incomplete

class Decimal(Scalar):
    @staticmethod
    def serialize(dec): ...
    @classmethod
    def parse_literal(cls, node, _variables: Incomplete | None = None): ...
    @staticmethod
    def parse_value(value): ...
