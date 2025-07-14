from ..types import Field as Field, InputObjectType as InputObjectType, String as String
from ..types.mutation import Mutation as Mutation
from ..utils.thenables import maybe_thenable as maybe_thenable
from _typeshed import Incomplete

class ClientIDMutation(Mutation):
    class Meta:
        abstract: bool

    @classmethod
    def __init_subclass_with_meta__(
        cls,
        output: Incomplete | None = None,
        input_fields: Incomplete | None = None,
        arguments: Incomplete | None = None,
        name: Incomplete | None = None,
        **options
    ) -> None: ...
    @classmethod
    def mutate(cls, root, info, input): ...
