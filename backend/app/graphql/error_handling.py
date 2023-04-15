import logging
from functools import wraps

from graphql import GraphQLError

from ..utilities.wrap_methods import WrapMethods

logger = logging.getLogger(__name__)


class ClientError(Exception):
    pass


def call_and_log_errors(resolve):
    @wraps(resolve)
    def do_resolve(*args, **kwargs):
        try:
            return resolve(*args, **kwargs)
        except (ClientError, GraphQLError) as error:
            raise error
        except Exception as error:
            logger.error(error, exc_info=error)
            raise GraphQLError(
                message="Unexpected error.",
                original_error=None,
            )

    return do_resolve


def LogErrors(*bases):
    metaclasses = [type(base) for base in bases]
    return WrapMethods(call_and_log_errors, *metaclasses)
