import requests
from typing import List

GEOCODE_API_URL = "https://geocode.maps.co/search"


def getGeocodeFromAddress(organization_address: str) -> List[float]:
    response = requests.get(
        '{base_url}?q="{address}"'.format(
            base_url=GEOCODE_API_URL, address=organization_address
        )
    )

    response_json = response.json()

    if len(response_json) == 0:
        raise Exception("Failed to get coordinates from Geocode API")

    return [float(response_json[0]["lon"]), float(response_json[0]["lat"])]
