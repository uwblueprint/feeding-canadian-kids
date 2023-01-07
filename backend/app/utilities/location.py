import mongoengine as mg


def convert_pointfield_to_coordinates(point: mg.PointField):
    coords = point["coordinates"]
    return {
        "latitude": coords[0],
        "longitude": coords[1],
    }
