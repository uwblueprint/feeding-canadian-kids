from ...models.simple_entity import SimpleEntity
from ..interfaces.simple_entity_service import ISimpleEntityService


class SimpleEntityService(ISimpleEntityService):
    def __init__(self, logger):
        self.logger = logger

    def get_entities(self):
        entities = []

        for result in SimpleEntity.objects:
            result_dict = result.to_serializable_dict()
            entities.append(result_dict)

        return entities

    def get_entity(self, id):
        entity = SimpleEntity.objects.get(id=id)

        if entity is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")

        return entity.to_serializable_dict()

    def create_entity(self, entity):
        try:
            new_entity = SimpleEntity(**entity.__dict__)
            new_entity.save()
        except Exception as error:
            self.logger.error(str(error))
            raise error

        return new_entity.to_serializable_dict()

    def update_entity(self, id, entity):
        updated_entity = SimpleEntity.objects(id=id).modify(new=True, **entity.__dict__)

        if updated_entity is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")

        return updated_entity.to_serializable_dict()

    def delete_entity(self, id):
        try:
            SimpleEntity.objects(id=id).modify(remove=True)
            return id
        except Exception as error:
            self.logger.error(str(error))
            raise error

