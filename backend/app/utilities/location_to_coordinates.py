import os

import requests

GEOCODE_API_URL = "https://geocode.maps.co/search"
GEOCODE_API_KEY = os.getenv("GEOCODING_API_KEY")


def getGeocodeFromAddress(organization_address):
    if "PYTEST_CURRENT_TEST" in os.environ:
        print("MOCKING LATITUDE IN TESTING")
        return [-11.1, 11.1]

    response = requests.get(
        '{base_url}?q="{address}"&api_key={api_key}'.format(
            base_url=GEOCODE_API_URL, address=organization_address, api_key=GEOCODE_API_KEY
        )
    )
    try:
        if response.status_code != 200:
            raise Exception("Failed to get coordinates from Geocode API")

        response_json = response.json()
        if len(response_json) == 0:
            raise Exception("Failed to get coordinates from Geocode API")
        return [float(response_json[0]["lon"]), float(response_json[0]["lat"])]
    except Exception as e:
        print("Failed when getting geoencoding from address!")
        raise e

