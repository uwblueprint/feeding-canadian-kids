import os
import requests

GEOCODE_API_URL = "https://geocode.maps.co/search"
GEOCODE_API_KEY = os.getenv("GEOCODING_API_KEY")
BASE_URL = "https://maps.googleapis.com/maps/api/geocode/"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

USE_GOOGLE_API = os.getenv("USE_GOOGLE_API", "1") == "1"

# NOTE: It's important all the errors in this file have the "GEOCODING" string in them since the frontend uses that to determine if the error is a geocoding error
def getGeocodeFromAddress(organization_address):
    if os.getenv("ENV") == "testing":
        print("MOCKING LATITUDE IN TESTING")
        return [-11.1, 11.1]

    if USE_GOOGLE_API:
        return getGeocodeFromAddressGoogle(organization_address)
    else:
        return getGeocodeFromAddressGeocode(organization_address)
        
    
def getGeocodeFromAddressGoogle(organization_address):
    response = requests.get(
        '{base_url}{output_format}?address={address}"&key={api_key}'.format(
            output_format="json",
            base_url=BASE_URL,
            address=organization_address,
            api_key=GOOGLE_API_KEY,
        )
    )
    try:
        if response.status_code != 200:
            raise Exception("GEOCODING: Failed to get coordinates from Geocode API")

        response_json = response.json()
        if len(response_json) == 0 or "results" not in response_json or not response_json["results"]:
            raise Exception("GEOCODING: Failed to get coordinates from Geocode API")

        return [
            float(response_json["results"][0]["geometry"]["location"]["lng"]),
            float(response_json["results"][0]["geometry"]["location"]["lat"]),
        ]
    except Exception as e:
        print("Failed when getting geoencoding from address!")
        print("Response:", response_json)
        print(f"Status code is: {response.status_code}")
        print("e is: ", e)
        raise Exception("GEOCODING: Failed to get coordinates from Geocode API")


def getGeocodeFromAddressGeocode(organization_address):
    response = requests.get(
        '{base_url}?q="{address}"&api_key={api_key}'.format(
            base_url=GEOCODE_API_URL,
            address=organization_address,
            api_key=GEOCODE_API_KEY,
        )
    )
    try:
        if response.status_code != 200:
            raise Exception("GEOCODING: Failed to get coordinates from Geocode API")

        response_json = response.json()
        if len(response_json) == 0:
            raise Exception("GEOCODING: Failed to get coordinates from Geocode API")
        return [float(response_json[0]["lon"]), float(response_json[0]["lat"])]
    except Exception as e:
        print("Failed when getting geoencoding from address!")
        print(f"Status code is: {response.status_code}")
        raise Exception("GEOCODING: Failed to get coordinates from Geocode API")