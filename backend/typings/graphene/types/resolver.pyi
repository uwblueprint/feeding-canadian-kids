def attr_resolver(attname, default_value, root, info, **args): ...
def dict_resolver(attname, default_value, root, info, **args): ...
def dict_or_attr_resolver(attname, default_value, root, info, **args): ...

default_resolver = dict_or_attr_resolver

def set_default_resolver(resolver) -> None: ...
def get_default_resolver(): ...
