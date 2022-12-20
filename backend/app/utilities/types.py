
from enum import Enum

class FoodRequestStatus(Enum):
	OPEN = "OPEN"
	MATCHED = "MATCHED"
	FULFILLED = "FULFILLED"
	CLOSED = "CLOSED"
