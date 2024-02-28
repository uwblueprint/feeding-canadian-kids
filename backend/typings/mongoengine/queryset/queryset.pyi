from mongoengine.queryset.base import (
    BaseQuerySet,
    CASCADE as CASCADE,
    DENY as DENY,
    DO_NOTHING as DO_NOTHING,
    NULLIFY as NULLIFY,
    PULL as PULL,
)

__all__ = [
    "QuerySet",
    "QuerySetNoCache",
    "DO_NOTHING",
    "NULLIFY",
    "CASCADE",
    "DENY",
    "PULL",
]

class QuerySet(BaseQuerySet):
    def __iter__(self): ...
    def __len__(self) -> int: ...
    def count(self, with_limit_and_skip: bool = False): ...
    def no_cache(self): ...

class QuerySetNoCache(BaseQuerySet):
    def cache(self): ...
    def __iter__(self): ...
