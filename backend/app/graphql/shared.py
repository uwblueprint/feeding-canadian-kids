import graphene

class GeoLocationInput(graphene.InputObjectType):
    latitude = graphene.Float(required=True)
    longitude = graphene.Float(required=True)

class GeoLocationResponse(graphene.ObjectType):
    latitude = graphene.Float(required=True)
    longitude = graphene.Float(required=True)