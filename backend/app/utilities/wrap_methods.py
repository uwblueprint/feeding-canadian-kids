from types import FunctionType


def WrapMethods(wrapper, *metaclasses):
    if not metaclasses:
        metaclasses = (type,)

    class MetaClass(*metaclasses):
        def __new__(meta, classname, bases, cls_dict):
            new_cls_dict = {}
            for key, value in cls_dict.items():
                if isinstance(value, FunctionType):
                    value = wrapper(value)
                new_cls_dict[key] = value
            return super().__new__(
                meta,
                classname,
                bases,
                new_cls_dict,
            )

    return MetaClass
