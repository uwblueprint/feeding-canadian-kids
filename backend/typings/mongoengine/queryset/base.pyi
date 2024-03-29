from _typeshed import Incomplete
from collections.abc import Generator

__all__ = ["BaseQuerySet", "DO_NOTHING", "NULLIFY", "CASCADE", "DENY", "PULL"]

DO_NOTHING: int
NULLIFY: int
CASCADE: int
DENY: int
PULL: int

class BaseQuerySet:
    def __init__(self, document, collection) -> None: ...
    def __call__(self, q_obj: Incomplete | None = None, **query): ...
    def __getitem__(self, key): ...
    def __iter__(self): ...
    def __bool__(self) -> bool: ...
    def all(self): ...
    def filter(self, *q_objs, **query): ...
    def search_text(self, text, language: Incomplete | None = None): ...
    def get(self, *q_objs, **query): ...
    def create(self, **kwargs): ...
    def first(self): ...
    def insert(
        self,
        doc_or_docs,
        load_bulk: bool = True,
        write_concern: Incomplete | None = None,
        signal_kwargs: Incomplete | None = None,
    ): ...
    def count(self, with_limit_and_skip: bool = False): ...
    def delete(
        self,
        write_concern: Incomplete | None = None,
        _from_doc_delete: bool = False,
        cascade_refs: Incomplete | None = None,
    ): ...
    def update(
        self,
        upsert: bool = False,
        multi: bool = True,
        write_concern: Incomplete | None = None,
        read_concern: Incomplete | None = None,
        full_result: bool = False,
        **update
    ): ...
    def upsert_one(
        self,
        write_concern: Incomplete | None = None,
        read_concern: Incomplete | None = None,
        **update
    ): ...
    def update_one(
        self,
        upsert: bool = False,
        write_concern: Incomplete | None = None,
        full_result: bool = False,
        **update
    ): ...
    def modify(
        self,
        upsert: bool = False,
        full_response: bool = False,
        remove: bool = False,
        new: bool = False,
        **update
    ): ...
    def with_id(self, object_id): ...
    def in_bulk(self, object_ids): ...
    def none(self): ...
    def no_sub_classes(self): ...
    def using(self, alias): ...
    def clone(self): ...
    def select_related(self, max_depth: int = 1): ...
    def limit(self, n): ...
    def skip(self, n): ...
    def hint(self, index: Incomplete | None = None): ...
    def collation(self, collation: Incomplete | None = None): ...
    def batch_size(self, size): ...
    def distinct(self, field): ...
    def only(self, *fields): ...
    def exclude(self, *fields): ...
    def fields(self, _only_called: bool = False, **kwargs): ...
    def all_fields(self): ...
    def order_by(self, *keys): ...
    def clear_cls_query(self): ...
    def comment(self, text): ...
    def explain(self): ...
    def snapshot(self, enabled): ...
    def allow_disk_use(self, enabled): ...
    def timeout(self, enabled): ...
    def read_preference(self, read_preference): ...
    def read_concern(self, read_concern): ...
    def scalar(self, *fields): ...
    def values_list(self, *fields): ...
    def as_pymongo(self): ...
    def max_time_ms(self, ms): ...
    def to_json(self, *args, **kwargs): ...
    def from_json(self, json_data): ...
    def aggregate(self, pipeline, *suppl_pipeline, **kwargs): ...
    def map_reduce(
        self,
        map_f,
        reduce_f,
        output,
        finalize_f: Incomplete | None = None,
        limit: Incomplete | None = None,
        scope: Incomplete | None = None,
    ) -> Generator[Incomplete, None, None]: ...
    def exec_js(self, code, *fields, **options): ...
    def where(self, where_clause): ...
    def sum(self, field): ...
    def average(self, field): ...
    def item_frequencies(
        self, field, normalize: bool = False, map_reduce: bool = True
    ): ...
    def __next__(self): ...
    def rewind(self) -> None: ...
    def __deepcopy__(self, memo): ...
    def no_dereference(self): ...
