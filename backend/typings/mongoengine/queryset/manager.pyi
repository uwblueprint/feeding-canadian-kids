from _typeshed import Incomplete
from mongoengine.queryset.queryset import QuerySet

__all__ = ['queryset_manager', 'QuerySetManager']

class QuerySetManager:
    get_queryset: Incomplete
    default = QuerySet
    def __init__(self, queryset_func: Incomplete | None = None) -> None: ...
    def __get__(self, instance, owner): ...

def queryset_manager(func): ...
