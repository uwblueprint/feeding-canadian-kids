from abc import ABC, abstractmethod
from graphene import Context

class LazyAttribute(ABC):
    @abstractmethod
    def __call__(self):
        pass

class LazyContext(Context):
    def __init__(self, **params):
        super().__init__(**params)

    def __getattribute__(self, key):
        attr = super().__getattribute__(key)
        if not isinstance(attr, LazyAttribute):
            return attr

        result = attr(self)
        setattr(self, key, result)
        return result
