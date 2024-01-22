from .base import BaseOptions as BaseOptions, BaseType as BaseType
from .unmountedtype import UnmountedType as UnmountedType
from _typeshed import Incomplete
from typing import Any

class ScalarOptions(BaseOptions): ...

class Scalar(UnmountedType, BaseType):
    @classmethod
    def __init_subclass_with_meta__(cls, **options) -> None: ...
    serialize: Incomplete
    parse_value: Incomplete
    parse_literal: Incomplete
    @classmethod
    def get_type(cls): ...

MAX_INT: int
MIN_INT: int

class Int(Scalar):
    @staticmethod
    def coerce_int(value): ...
    serialize = coerce_int
    parse_value = coerce_int
    @staticmethod
    def parse_literal(ast, _variables: Incomplete | None = None): ...

class BigInt(Scalar):
    @staticmethod
    def coerce_int(value): ...
    serialize = coerce_int
    parse_value = coerce_int
    @staticmethod
    def parse_literal(ast, _variables: Incomplete | None = None): ...

class Float(Scalar):
    @staticmethod
    def coerce_float(value: Any) -> float: ...
    serialize = coerce_float
    parse_value = coerce_float
    @staticmethod
    def parse_literal(ast, _variables: Incomplete | None = None): ...

class String(Scalar):
    @staticmethod
    def coerce_string(value): ...
    serialize = coerce_string
    parse_value = coerce_string
    @staticmethod
    def parse_literal(ast, _variables: Incomplete | None = None): ...

class Boolean(Scalar):
    serialize = bool
    parse_value = bool
    @staticmethod
    def parse_literal(ast, _variables: Incomplete | None = None): ...

class ID(Scalar):
    serialize = str
    parse_value = str
    @staticmethod
    def parse_literal(ast, _variables: Incomplete | None = None): ...
