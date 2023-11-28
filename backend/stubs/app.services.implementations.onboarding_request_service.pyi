from app.resources.onboarding_request_dto import OnboardingRequestDTO
from typing import List


class OnboardingRequestService:
    def get_all_onboarding_requests(
        self,
        number: int = ...,
        offset: int = ...,
        role: str = ...,
        status: str = ...
    ) -> List[OnboardingRequestDTO]: ...
    def get_onboarding_request_by_id(self, id: str) -> OnboardingRequestDTO: ...
