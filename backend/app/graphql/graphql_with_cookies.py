from graphql_server.flask import GraphQLView

class GraphQLViewWithCookies(GraphQLView):
    request_context = None

    def get_context(self):
        return self.request_context

    def dispatch_request(self):
        self.request_context = super().get_context()
        self.request_context["response_cookies"] = self.request_context["request"].cookies.to_dict()
        response = super().dispatch_request()
        if response.status_code == 200:
            for cookie in self.request_context["response_cookies"]:
                response.set_cookie(cookie, self.request_context["response_cookies"][cookie], httponly = True)
        return response
