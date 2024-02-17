from _typeshed import Incomplete
from mongoengine.base import BaseDocument, DocumentMetaclass, TopLevelDocumentMetaclass
from mongoengine.queryset import (
    NotUniqueError as NotUniqueError,
    OperationError as OperationError,
)

__all__ = [
    "Document",
    "EmbeddedDocument",
    "DynamicDocument",
    "DynamicEmbeddedDocument",
    "OperationError",
    "InvalidCollectionError",
    "NotUniqueError",
    "MapReduceDocument",
]

class InvalidCollectionError(Exception): ...

class EmbeddedDocument(BaseDocument, metaclass=DocumentMetaclass):
    my_metaclass = DocumentMetaclass
    __hash__: Incomplete
    def __init__(self, *args, **kwargs) -> None: ...
    def __eq__(self, other): ...
    def __ne__(self, other): ...
    def to_mongo(self, *args, **kwargs): ...

class Document(BaseDocument, metaclass=TopLevelDocumentMetaclass):
    my_metaclass = TopLevelDocumentMetaclass
    @property
    def pk(self): ...
    @pk.setter
    def pk(self, value): ...
    def __hash__(self): ...
    def to_mongo(self, *args, **kwargs): ...
    def modify(self, query: Incomplete | None = None, **update): ...
    def save(
        self,
        force_insert: bool = False,
        validate: bool = True,
        clean: bool = True,
        write_concern: Incomplete | None = None,
        cascade: Incomplete | None = None,
        cascade_kwargs: Incomplete | None = None,
        _refs: Incomplete | None = None,
        save_condition: Incomplete | None = None,
        signal_kwargs: Incomplete | None = None,
        **kwargs
    ): ...
    def cascade_save(self, **kwargs) -> None: ...
    def update(self, **kwargs): ...
    def delete(
        self, signal_kwargs: Incomplete | None = None, **write_concern
    ) -> None: ...
    def switch_db(self, db_alias, keep_created: bool = True): ...
    def switch_collection(self, collection_name, keep_created: bool = True): ...
    def select_related(self, max_depth: int = 1): ...
    def reload(self, *fields, **kwargs): ...
    def to_dbref(self): ...
    @classmethod
    def register_delete_rule(cls, document_cls, field_name, rule) -> None: ...
    @classmethod
    def drop_collection(cls) -> None: ...
    @classmethod
    def create_index(cls, keys, background: bool = False, **kwargs): ...
    @classmethod
    def ensure_indexes(cls) -> None: ...
    @classmethod
    def list_indexes(cls): ...
    @classmethod
    def compare_indexes(cls): ...
    @staticmethod
    def objects(**kwargs): ...

class DynamicDocument(Document, metaclass=TopLevelDocumentMetaclass):
    my_metaclass = TopLevelDocumentMetaclass
    def __delattr__(self, *args, **kwargs) -> None: ...

class DynamicEmbeddedDocument(EmbeddedDocument, metaclass=DocumentMetaclass):
    my_metaclass = DocumentMetaclass
    def __delattr__(self, *args, **kwargs) -> None: ...

class MapReduceDocument:
    key: Incomplete
    value: Incomplete
    def __init__(self, document, collection, key, value) -> None: ...
    @property
    def object(self): ...