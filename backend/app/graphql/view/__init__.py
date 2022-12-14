from graphene import Context
from flask import g
from graphql_server.flask import GraphQLView as BaseGraphQLView
from collections.abc import MutableMapping
from .cookies import Cookies


class GraphQLView(BaseGraphQLView):
    def get_context(self):
        # g.context is a request-specific global variable
        return g.context

    def __setup_request(self):
        # Insert the request cookies into the context.
        context = Context(**super().get_context())
        if isinstance(context, MutableMapping) and "cookies" not in context:
            context.cookies = Cookies(context)
        g.context = context

    def __process_response(self, response):
        if isinstance(response, str):
            # Rendering an HTML page.
            return response

        if response.status_code != 200:
            # An error occurred, so let's not set any cookies.
            return response

        # Copy the cookies over into the response.
        return g.context.cookies.add_to_response(response)

    def dispatch_request(self):
        self.__setup_request()
        response = super().dispatch_request()
        return self.__process_response(response)
