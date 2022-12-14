from unittest.mock import Mock, call
from graphene import Context
from app.graphql.view.cookies import Cookies
import pytest


REQUEST_COOKIES = {
    "foo": 1,
    "bar": 2,
    "baz": 3,
}


@pytest.fixture
def cookies():
    return Cookies(Context(request=Context(cookies=REQUEST_COOKIES)))

@pytest.fixture
def response():
    return Mock(set_cookie=Mock())


def test_read_request_cookies(cookies, response):
    for key, value in REQUEST_COOKIES.items():
        assert getattr(cookies, key) == value

def test_request_and_response_cookies_are_independent(cookies, response):
    cookies.add_to_response(response)
    response.set_cookie.assert_not_called()

    cookies.qux = 4
    cookies.add_to_response(response)

    response.set_cookie.assert_called_with("qux", 4, httponly=True)

def test_response_overrides_request(cookies, response):
    cookies.foo = 4
    cookies.add_to_response(response)
    response.set_cookie.assert_called_with("foo", 4, httponly=True)

def test_unset_cookies_are_deleted(cookies, response):
    del cookies.qux
    cookies.add_to_response(response)
    response.set_cookie.assert_called_with("qux", "", expires=0, httponly=True)

def test_deleted_cookies_are_removed(cookies, response):
    cookies.qux = 4
    del cookies.qux
    cookies.add_to_response(response)
    response.set_cookie.assert_has_calls([
        call("qux", 4, httponly=True),
        call("qux", "", expires=0, httponly=True),
    ])
