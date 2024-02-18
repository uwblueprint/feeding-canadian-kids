from ..utils.orderedtype import OrderedType as OrderedType
from .unmountedtype import UnmountedType as UnmountedType

class MountedType(OrderedType):
    @classmethod
    def mounted(cls, unmounted): ...
