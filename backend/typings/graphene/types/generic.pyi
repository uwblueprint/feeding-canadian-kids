from .scalars import Scalar as Scalar
from _typeshed import Incomplete
from graphene.types.scalars import MAX_INT as MAX_INT, MIN_INT as MIN_INT

class GenericScalar(Scalar):
    @staticmethod
    def identity(value): ...
    serialize = identity
    parse_value = identity
    @staticmethod
    def parse_literal(ast, _variables: Incomplete | None = None): ...
