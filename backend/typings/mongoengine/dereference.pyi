from _typeshed import Incomplete
from mongoengine.base import BaseDict as BaseDict, BaseList as BaseList, EmbeddedDocumentList as EmbeddedDocumentList, TopLevelDocumentMetaclass as TopLevelDocumentMetaclass, get_document as get_document
from mongoengine.base.datastructures import LazyReference as LazyReference
from mongoengine.connection import get_db as get_db
from mongoengine.document import Document as Document, EmbeddedDocument as EmbeddedDocument
from mongoengine.fields import DictField as DictField, ListField as ListField, MapField as MapField, ReferenceField as ReferenceField
from mongoengine.queryset import QuerySet as QuerySet

class DeReference:
    max_depth: Incomplete
    reference_map: Incomplete
    object_map: Incomplete
    def __call__(self, items, max_depth: int = 1, instance: Incomplete | None = None, name: Incomplete | None = None): ...
