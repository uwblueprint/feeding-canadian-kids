from .props import props as props

class SubclassWithMeta_Meta(type): ...

class SubclassWithMeta(metaclass=SubclassWithMeta_Meta):
    def __init_subclass__(cls, **meta_options) -> None: ...
    @classmethod
    def __init_subclass_with_meta__(cls, **meta_options) -> None: ...
