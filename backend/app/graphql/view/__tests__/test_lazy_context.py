import pytest
from unittest.mock import Mock
from app.graphql.view.lazy_context import LazyAttribute, LazyContext

def mock_function():
    pass

def test_normal_attributes():
    context = LazyContext(foo=1, bar=2, baz=mock_function)
    assert context.foo == 1
    assert context.bar == 2
    assert context.baz == mock_function

def test_lazy_attribute():
    class SampleAttribute(LazyAttribute):
        __call__ = Mock(return_value=3)

    attr = SampleAttribute()
    context = LazyContext(qux=attr)

    attr.__call__.assert_not_called()
    assert context.qux == 3  # This should call the attribute now.
    attr.__call__.assert_called_once()

    attr.__call__.reset_mock()
    assert context.qux == 3  # This should not be computed again.
    attr.__call__.assert_not_called()
