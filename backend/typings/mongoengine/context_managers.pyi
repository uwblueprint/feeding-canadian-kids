from _typeshed import Incomplete
from collections.abc import Generator

__all__ = [
    "switch_db",
    "switch_collection",
    "no_dereference",
    "no_sub_classes",
    "query_counter",
    "set_write_concern",
    "set_read_write_concern",
]

class switch_db:
    cls: Incomplete
    collection: Incomplete
    db_alias: Incomplete
    ori_db_alias: Incomplete
    def __init__(self, cls, db_alias) -> None: ...
    def __enter__(self): ...
    def __exit__(
        self,
        t: type[BaseException] | None,
        value: BaseException | None,
        traceback: types.TracebackType | None,
    ) -> None: ...

class switch_collection:
    cls: Incomplete
    ori_collection: Incomplete
    ori_get_collection_name: Incomplete
    collection_name: Incomplete
    def __init__(self, cls, collection_name) -> None: ...
    def __enter__(self): ...
    def __exit__(
        self,
        t: type[BaseException] | None,
        value: BaseException | None,
        traceback: types.TracebackType | None,
    ) -> None: ...

class no_dereference:
    cls: Incomplete
    deref_fields: Incomplete
    def __init__(self, cls) -> None: ...
    def __enter__(self): ...
    def __exit__(
        self,
        t: type[BaseException] | None,
        value: BaseException | None,
        traceback: types.TracebackType | None,
    ): ...

class no_sub_classes:
    cls: Incomplete
    cls_initial_subclasses: Incomplete
    def __init__(self, cls) -> None: ...
    def __enter__(self): ...
    def __exit__(
        self,
        t: type[BaseException] | None,
        value: BaseException | None,
        traceback: types.TracebackType | None,
    ) -> None: ...

class query_counter:
    db: Incomplete
    initial_profiling_level: Incomplete
    def __init__(self, alias=...) -> None: ...
    def __enter__(self): ...
    def __exit__(
        self,
        t: type[BaseException] | None,
        value: BaseException | None,
        traceback: types.TracebackType | None,
    ) -> None: ...
    def __eq__(self, value): ...
    def __ne__(self, value): ...
    def __lt__(self, value): ...
    def __le__(self, value): ...
    def __gt__(self, value): ...
    def __ge__(self, value): ...
    def __int__(self) -> int: ...

def set_write_concern(
    collection, write_concerns
) -> Generator[Incomplete, None, None]: ...
def set_read_write_concern(
    collection, write_concerns, read_concerns
) -> Generator[Incomplete, None, None]: ...
