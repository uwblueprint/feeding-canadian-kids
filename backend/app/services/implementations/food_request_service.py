from datetime import datetime
from ...models.food_request import FoodRequest
from ..interfaces.food_request_service import IFoodRequestService
from ...utilities.types import FoodRequestStatus
from ...utilities.location import convert_pointfield_to_coordinates


class FoodRequestService(IFoodRequestService):
    def __init__(self, logger, user_service):
        self.logger = logger
        self.user_service = user_service

    def create_food_requests(self, food_request_data: dict):
        print(food_request_data)
        try:
            now = datetime.utcnow
            dates = food_request_data.pop("dates")

            # format location
            location = food_request_data.pop("location")
            lat, lng = location["latitude"], location["longitude"]

            # priority of the ASP
            try:
                priority = self.__get_requestor_priority(food_request_data["requestor_id"])
            except Exception as e:
                self.logger.error(str(e))
                priority = 0 

            requests = [
                FoodRequest(
                    **food_request_data,
                    date=date,
                    location=[lat, lng],
                    portions_fulfilled=0,
                    date_created=now,
                    date_updated=now,
                    is_open=True,
                    priority=priority
                )
                for date in dates
            ]
            FoodRequest.objects.insert(requests)
            return map(
                lambda x: {
                    **x.to_serializable_dict(),
                    "status": self.__get_food_request_status(x),
                    "location": {"latitude": lat, "longitude": lng},
                },
                requests,
            )
        except Exception as error:
            self.logger.error(str(error))
            raise error

    def get_food_requests(self, limit, offset, status=None, near_location=None):
        try:
            result = FoodRequest.objects()

            if status is not None:
                result = self.__filter_food_requests_by_status(result, status)

            if near_location is not None:
                result.aggregate(
                    [
                        # outputs documents in order of nearest to farthest
                        {
                            "$geoNear": {
                                "key": "location",
                                "near": near_location,
                                "distanceField": "distance",
                                "maxDistance": 15000,
                                "spherical": True,
                            }
                        },
                        # sort by priority - lower number = higher priority
                        {"$sort": {"priority": 1}},
                    ]
                )

       
            return map(
                lambda x: {
                    **x.to_serializable_dict(),
                    "status": self.__get_food_request_status(x),
                    "location": convert_pointfield_to_coordinates(x["location"]),
                },
                result.skip(offset).limit(limit),
            )
        except Exception as e:
            self.logger.error(str(e))
            raise e

    def get_food_requests_by_user(self, limit, offset, user_id, role, status):
        try:
            result = FoodRequest.objects()
            if status is not None:
                result = self.__filter_food_requests_by_status(result, status)
            if role == "ASP":
                result = result.filter(requestor_id=user_id)
            elif role == "Donor":
                result = result.filter(donor_id=user_id)

            res = map(
                lambda x: {
                    **x.to_serializable_dict(),
                    "status": self.__get_food_request_status(x),
                    "location": convert_pointfield_to_coordinates(x["location"]),
                },
                result.skip(offset).limit(limit),
            )
            print({
                    **result[0].to_serializable_dict(),
                    # "status": self.__get_food_request_status(x),
                    # "location": convert_pointfield_to_coordinates(x["location"]),
                })
            return res
        except Exception as e:
            self.logger.error(str(e))
            raise e

    @staticmethod
    def __get_food_request_status(food_request):
        if food_request.date_fulfilled is not None:
            return FoodRequestStatus.FULFILLED.value
        elif food_request.donor_id is not None:
            return FoodRequestStatus.MATCHED.value
        elif food_request.is_open:
            return FoodRequestStatus.OPEN.value
        else:
            return FoodRequestStatus.CLOSED.value

    @staticmethod
    def __filter_food_requests_by_status(food_requests, status):
        if status is None:
            return food_requests
        else:
            if status == FoodRequestStatus.OPEN:
                return food_requests.filter(is_open=True)
            elif status == FoodRequestStatus.CLOSED:
                return food_requests.filter(is_open=False)
            elif status == FoodRequestStatus.MATCHED:
                return food_requests.filter(donor_id__ne=None)
            elif status == FoodRequestStatus.FULFILLED:
                return food_requests.filter(date_fulfilled__ne=None)
            else:
                raise ValueError("Invalid status")

    def __get_requestor_priority(self, requestor_id):
        """
        Returns the priority of the requestor. If the requestor is not an ASP,
        returns 0.
        """
        requestor = self.user_service.get_user_by_id(requestor_id)
        if requestor.role == "ASP":
            return requestor.priority
        return 0
