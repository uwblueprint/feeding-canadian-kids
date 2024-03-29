from _typeshed import Incomplete
from mongoengine.base import (
    BaseField,
    ComplexBaseField,
    GeoJsonBaseField as GeoJsonBaseField,
    ObjectIdField as ObjectIdField,
)

__all__ = [
    "StringField",
    "URLField",
    "EmailField",
    "IntField",
    "LongField",
    "FloatField",
    "DecimalField",
    "BooleanField",
    "DateTimeField",
    "DateField",
    "ComplexDateTimeField",
    "EmbeddedDocumentField",
    "ObjectIdField",
    "GenericEmbeddedDocumentField",
    "DynamicField",
    "ListField",
    "SortedListField",
    "EmbeddedDocumentListField",
    "DictField",
    "MapField",
    "ReferenceField",
    "CachedReferenceField",
    "LazyReferenceField",
    "GenericLazyReferenceField",
    "GenericReferenceField",
    "BinaryField",
    "GridFSError",
    "GridFSProxy",
    "FileField",
    "ImageGridFsProxy",
    "ImproperlyConfigured",
    "ImageField",
    "GeoPointField",
    "PointField",
    "LineStringField",
    "PolygonField",
    "SequenceField",
    "UUIDField",
    "EnumField",
    "MultiPointField",
    "MultiLineStringField",
    "MultiPolygonField",
    "GeoJsonBaseField",
    "Decimal128Field",
]

class StringField(BaseField):
    regex: Incomplete
    max_length: Incomplete
    min_length: Incomplete
    def __init__(
        self,
        regex: Incomplete | None = None,
        max_length: Incomplete | None = None,
        min_length: Incomplete | None = None,
        **kwargs
    ) -> None: ...
    def to_python(self, value): ...
    def validate(self, value) -> None: ...
    def lookup_member(self, member_name) -> None: ...
    def prepare_query_value(self, op, value): ...

class URLField(StringField):
    url_regex: Incomplete
    schemes: Incomplete
    def __init__(
        self,
        url_regex: Incomplete | None = None,
        schemes: Incomplete | None = None,
        **kwargs
    ) -> None: ...
    def validate(self, value) -> None: ...

class EmailField(StringField):
    USER_REGEX: Incomplete
    UTF8_USER_REGEX: Incomplete
    DOMAIN_REGEX: Incomplete
    error_msg: str
    domain_whitelist: Incomplete
    allow_utf8_user: Incomplete
    allow_ip_domain: Incomplete
    def __init__(
        self,
        domain_whitelist: Incomplete | None = None,
        allow_utf8_user: bool = False,
        allow_ip_domain: bool = False,
        *args,
        **kwargs
    ) -> None: ...
    def validate_user_part(self, user_part): ...
    def validate_domain_part(self, domain_part): ...
    def validate(self, value) -> None: ...

class IntField(BaseField):
    def __init__(
        self,
        min_value: Incomplete | None = None,
        max_value: Incomplete | None = None,
        **kwargs
    ) -> None: ...
    def to_python(self, value): ...
    def validate(self, value) -> None: ...
    def prepare_query_value(self, op, value): ...

class LongField(IntField):
    def to_mongo(self, value): ...

class FloatField(BaseField):
    def __init__(
        self,
        min_value: Incomplete | None = None,
        max_value: Incomplete | None = None,
        **kwargs
    ) -> None: ...
    def to_python(self, value): ...
    def validate(self, value) -> None: ...
    def prepare_query_value(self, op, value): ...

class DecimalField(BaseField):
    min_value: Incomplete
    max_value: Incomplete
    force_string: Incomplete
    precision: Incomplete
    rounding: Incomplete
    def __init__(
        self,
        min_value: Incomplete | None = None,
        max_value: Incomplete | None = None,
        force_string: bool = False,
        precision: int = 2,
        rounding=...,
        **kwargs
    ) -> None: ...
    def to_python(self, value): ...
    def to_mongo(self, value): ...
    def validate(self, value) -> None: ...
    def prepare_query_value(self, op, value): ...

class BooleanField(BaseField):
    def to_python(self, value): ...
    def validate(self, value) -> None: ...

class DateTimeField(BaseField):
    def validate(self, value) -> None: ...
    def to_mongo(self, value): ...
    def prepare_query_value(self, op, value): ...

class DateField(DateTimeField):
    def to_mongo(self, value): ...
    def to_python(self, value): ...

class ComplexDateTimeField(StringField):
    separator: Incomplete
    format: Incomplete
    def __init__(self, separator: str = ",", **kwargs) -> None: ...
    def __get__(self, instance, owner): ...
    def __set__(self, instance, value) -> None: ...
    def validate(self, value) -> None: ...
    def to_python(self, value): ...
    def to_mongo(self, value): ...
    def prepare_query_value(self, op, value): ...

class EmbeddedDocumentField(BaseField):
    document_type_obj: Incomplete
    def __init__(self, document_type, **kwargs) -> None: ...
    @property
    def document_type(self): ...
    def to_python(self, value): ...
    def to_mongo(
        self, value, use_db_field: bool = True, fields: Incomplete | None = None
    ): ...
    def validate(self, value, clean: bool = True) -> None: ...
    def lookup_member(self, member_name): ...
    def prepare_query_value(self, op, value): ...

class GenericEmbeddedDocumentField(BaseField):
    def prepare_query_value(self, op, value): ...
    def to_python(self, value): ...
    def validate(self, value, clean: bool = True): ...
    def lookup_member(self, member_name): ...
    def to_mongo(
        self, document, use_db_field: bool = True, fields: Incomplete | None = None
    ): ...

class DynamicField(BaseField):
    def to_mongo(
        self, value, use_db_field: bool = True, fields: Incomplete | None = None
    ): ...
    def to_python(self, value): ...
    def lookup_member(self, member_name): ...
    def prepare_query_value(self, op, value): ...
    def validate(self, value, clean: bool = True) -> None: ...

class ListField(ComplexBaseField):
    max_length: Incomplete
    def __init__(
        self,
        field: Incomplete | None = None,
        max_length: Incomplete | None = None,
        **kwargs
    ) -> None: ...
    def __get__(self, instance, owner): ...
    def validate(self, value) -> None: ...
    def prepare_query_value(self, op, value): ...

class EmbeddedDocumentListField(ListField):
    def __init__(self, document_type, **kwargs) -> None: ...

class SortedListField(ListField):
    def __init__(self, field, **kwargs) -> None: ...
    def to_mongo(
        self, value, use_db_field: bool = True, fields: Incomplete | None = None
    ): ...

class DictField(ComplexBaseField):
    def __init__(self, field: Incomplete | None = None, *args, **kwargs) -> None: ...
    def validate(self, value) -> None: ...
    def lookup_member(self, member_name): ...
    def prepare_query_value(self, op, value): ...

class MapField(DictField):
    def __init__(self, field: Incomplete | None = None, *args, **kwargs) -> None: ...

class ReferenceField(BaseField):
    dbref: Incomplete
    document_type_obj: Incomplete
    reverse_delete_rule: Incomplete
    def __init__(
        self, document_type, dbref: bool = False, reverse_delete_rule=..., **kwargs
    ) -> None: ...
    @property
    def document_type(self): ...
    def __get__(self, instance, owner): ...
    def to_mongo(self, document): ...
    def to_python(self, value): ...
    def prepare_query_value(self, op, value): ...
    def validate(self, value) -> None: ...
    def lookup_member(self, member_name): ...

class CachedReferenceField(BaseField):
    auto_sync: Incomplete
    document_type_obj: Incomplete
    fields: Incomplete
    def __init__(
        self,
        document_type,
        fields: Incomplete | None = None,
        auto_sync: bool = True,
        **kwargs
    ) -> None: ...
    def start_listener(self) -> None: ...
    def on_document_pre_save(self, sender, document, created, **kwargs) -> None: ...
    def to_python(self, value): ...
    @property
    def document_type(self): ...
    def __get__(self, instance, owner): ...
    def to_mongo(
        self, document, use_db_field: bool = True, fields: Incomplete | None = None
    ): ...
    def prepare_query_value(self, op, value): ...
    def validate(self, value) -> None: ...
    def lookup_member(self, member_name): ...
    def sync_all(self) -> None: ...

class GenericReferenceField(BaseField):
    choices: Incomplete
    def __init__(self, *args, **kwargs) -> None: ...
    def __get__(self, instance, owner): ...
    def validate(self, value) -> None: ...
    def to_mongo(self, document): ...
    def prepare_query_value(self, op, value): ...

class BinaryField(BaseField):
    max_bytes: Incomplete
    def __init__(self, max_bytes: Incomplete | None = None, **kwargs) -> None: ...
    def __set__(self, instance, value): ...
    def to_mongo(self, value): ...
    def validate(self, value) -> None: ...
    def prepare_query_value(self, op, value): ...

class EnumField(BaseField):
    def __init__(self, enum, **kwargs) -> None: ...
    def validate(self, value): ...
    def to_python(self, value): ...
    def __set__(self, instance, value): ...
    def to_mongo(self, value): ...
    def prepare_query_value(self, op, value): ...

class GridFSError(Exception): ...

class GridFSProxy:
    grid_id: Incomplete
    key: Incomplete
    instance: Incomplete
    db_alias: Incomplete
    collection_name: Incomplete
    newfile: Incomplete
    gridout: Incomplete
    def __init__(
        self,
        grid_id: Incomplete | None = None,
        key: Incomplete | None = None,
        instance: Incomplete | None = None,
        db_alias=...,
        collection_name: str = "fs",
    ) -> None: ...
    def __getattr__(self, name): ...
    def __get__(self, instance, value): ...
    def __bool__(self) -> bool: ...
    def __copy__(self): ...
    def __deepcopy__(self, memo): ...
    def __eq__(self, other): ...
    def __ne__(self, other): ...
    @property
    def fs(self): ...
    def get(self, grid_id: Incomplete | None = None): ...
    def new_file(self, **kwargs) -> None: ...
    def put(self, file_obj, **kwargs) -> None: ...
    def write(self, string) -> None: ...
    def writelines(self, lines) -> None: ...
    def read(self, size: int = -1): ...
    def delete(self) -> None: ...
    def replace(self, file_obj, **kwargs) -> None: ...
    def close(self) -> None: ...

class FileField(BaseField):
    proxy_class = GridFSProxy
    collection_name: Incomplete
    db_alias: Incomplete
    def __init__(self, db_alias=..., collection_name: str = "fs", **kwargs) -> None: ...
    def __get__(self, instance, owner): ...
    def __set__(self, instance, value) -> None: ...
    def get_proxy_obj(
        self,
        key,
        instance,
        db_alias: Incomplete | None = None,
        collection_name: Incomplete | None = None,
    ): ...
    def to_mongo(self, value): ...
    def to_python(self, value): ...
    def validate(self, value) -> None: ...

class ImageGridFsProxy(GridFSProxy):
    def put(self, file_obj, **kwargs): ...
    def delete(self, *args, **kwargs): ...
    @property
    def size(self): ...
    @property
    def format(self): ...
    @property
    def thumbnail(self): ...
    def write(self, *args, **kwargs) -> None: ...
    def writelines(self, *args, **kwargs) -> None: ...

class ImproperlyConfigured(Exception): ...

class ImageField(FileField):
    proxy_class = ImageGridFsProxy
    def __init__(
        self,
        size: Incomplete | None = None,
        thumbnail_size: Incomplete | None = None,
        collection_name: str = "images",
        **kwargs
    ) -> None: ...

class SequenceField(BaseField):
    COLLECTION_NAME: str
    VALUE_DECORATOR = int
    collection_name: Incomplete
    db_alias: Incomplete
    sequence_name: Incomplete
    value_decorator: Incomplete
    def __init__(
        self,
        collection_name: Incomplete | None = None,
        db_alias: Incomplete | None = None,
        sequence_name: Incomplete | None = None,
        value_decorator: Incomplete | None = None,
        *args,
        **kwargs
    ) -> None: ...
    def generate(self): ...
    def set_next_value(self, value): ...
    def get_next_value(self): ...
    def get_sequence_name(self): ...
    def __get__(self, instance, owner): ...
    def __set__(self, instance, value): ...
    def prepare_query_value(self, op, value): ...
    def to_python(self, value): ...

class UUIDField(BaseField):
    def __init__(self, binary: bool = True, **kwargs) -> None: ...
    def to_python(self, value): ...
    def to_mongo(self, value): ...
    def prepare_query_value(self, op, value): ...
    def validate(self, value) -> None: ...

class GeoPointField(BaseField):
    def validate(self, value) -> None: ...

class PointField(GeoJsonBaseField): ...
class LineStringField(GeoJsonBaseField): ...
class PolygonField(GeoJsonBaseField): ...
class MultiPointField(GeoJsonBaseField): ...
class MultiLineStringField(GeoJsonBaseField): ...
class MultiPolygonField(GeoJsonBaseField): ...

class LazyReferenceField(BaseField):
    dbref: Incomplete
    passthrough: Incomplete
    document_type_obj: Incomplete
    reverse_delete_rule: Incomplete
    def __init__(
        self,
        document_type,
        passthrough: bool = False,
        dbref: bool = False,
        reverse_delete_rule=...,
        **kwargs
    ) -> None: ...
    @property
    def document_type(self): ...
    def build_lazyref(self, value): ...
    def __get__(self, instance, owner): ...
    def to_mongo(self, value): ...
    def to_python(self, value): ...
    def validate(self, value) -> None: ...
    def prepare_query_value(self, op, value): ...
    def lookup_member(self, member_name): ...

class GenericLazyReferenceField(GenericReferenceField):
    passthrough: Incomplete
    def __init__(self, *args, **kwargs) -> None: ...
    def build_lazyref(self, value): ...
    def __get__(self, instance, owner): ...
    def validate(self, value): ...
    def to_mongo(self, document): ...

class Decimal128Field(BaseField):
    DECIMAL_CONTEXT: Incomplete
    min_value: Incomplete
    max_value: Incomplete
    def __init__(
        self,
        min_value: Incomplete | None = None,
        max_value: Incomplete | None = None,
        **kwargs
    ) -> None: ...
    def to_mongo(self, value): ...
    def to_python(self, value): ...
    def validate(self, value) -> None: ...
    def prepare_query_value(self, op, value): ...
