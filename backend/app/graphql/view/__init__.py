from flask import g
from graphql_server.flask import GraphQLView as BaseGraphQLView
from .cookies import Cookies
from .lazy_firebase_user import LazyFirebaseUser
from .lazy_user import LazyUser
from .lazy_context import LazyContext


def get_access_token(request):
    auth_header = request.headers.get("Authorization")
    if auth_header:
        auth_header_parts = auth_header.split(" ")
        if len(auth_header_parts) >= 2 and auth_header_parts[0].lower() == "bearer":
            return auth_header_parts[1]
    return None


class GraphQLView(BaseGraphQLView):
    def get_context(self):
        # g.context is a request-specific global variable
        return g.context

    def __setup_request(self):
        # Save the global context for this request.
        context = LazyContext(**super().get_context())
        g.context = context

        # Insert additional request details into the context.
        context.cookies = Cookies(context)
        context.access_token = get_access_token(context.request)
        context.firebase_user = LazyFirebaseUser()
        context.user = LazyUser()

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
