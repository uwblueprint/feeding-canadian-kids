import os
import requests

BASE_URL = "https://maps.googleapis.com/maps/api/geocode/"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


def getGeocodeFromAddress(organization_address):
    if os.getenv("ENV") == "testing":
        print("MOCKING LATITUDE IN TESTING")
        return [-11.1, 11.1]

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
            raise Exception("Failed to get coordinates from Geocode API")

        response_json = response.json()
        if len(response_json) == 0:
            raise Exception("Failed to get coordinates from Geocode API")
        return [
            float(response_json["results"][0]["geometry"]["location"]["lng"]),
            float(response_json["results"][0]["geometry"]["location"]["lat"]),
        ]
    except Exception as e:
        print("Failed when getting geoencoding from address!")
        print(f"Status code is: {response.status_code}")
        raise e
