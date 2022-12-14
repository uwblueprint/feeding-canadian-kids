from werkzeug.datastructures import MultiDict


class Cookies:
    def __init__(self, context):
        cookies_dict = context.request.cookies
        self.__request_dict = cookies_dict
        self.__response_dict = MultiDict()
        self.__response_del = set()

    def __setattr__(self, key, value):
        # Prevent infinite recursion in __init__.
        if key.startswith("_Cookies__") and not hasattr(
            self, "_Cookies__response_del"
        ):
            return super().__setattr__(key, value)

        # Don't allow reassigning class methods.
        if key in {"add_to_response"}:
            raise ValueError(f"Cannot reassign class method {key}")

        result = self.__response_dict.setlist(key, [value])
        if key in self.__response_del:
            self.__response_del.remove(key)
        return result

    def __getattr__(self, key):
        if key.startswith("_Cookies"):
            return super().__getattribute__(key)
        if key in self.__response_dict:
            return self.__response_dict.get(key)
        return self.__request_dict.get(key)

    def __delattr__(self, key):
        self.__response_del.add(key)

    def __repr__(self):
        return (
            f"Cookies(request={self.__request_dict}, response={self.__response_dict})"
        )

    def add_to_response(self, response):
        for key, value in self.__response_dict.items():
            response.set_cookie(key, value, httponly=True)
        for key in self.__response_del:
            response.set_cookie(key, "", expires=0, httponly=True)
        return response
