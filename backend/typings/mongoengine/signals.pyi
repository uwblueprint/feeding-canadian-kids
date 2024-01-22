from _typeshed import Incomplete

__all__ = ['pre_init', 'post_init', 'pre_save', 'pre_save_post_validation', 'post_save', 'pre_delete', 'post_delete']

class Namespace:
    def signal(self, name, doc: Incomplete | None = None): ...

class _FakeSignal:
    name: Incomplete
    __doc__: Incomplete
    def __init__(self, name, doc: Incomplete | None = None) -> None: ...
    send: Incomplete
    connect: Incomplete
    disconnect: Incomplete
    has_receivers_for: Incomplete
    receivers_for: Incomplete
    temporarily_connected_to: Incomplete

pre_init: Incomplete
post_init: Incomplete
pre_save: Incomplete
pre_save_post_validation: Incomplete
post_save: Incomplete
pre_delete: Incomplete
post_delete: Incomplete
