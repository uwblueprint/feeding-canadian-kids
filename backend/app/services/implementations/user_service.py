from decimal import Decimal
import firebase_admin.auth
from ...models.user_info import UserInfo

from ...services.interfaces.onsite_contact_service import IOnsiteContactService
from ...models.onboarding_request import OnboardingRequest
from ..interfaces.user_service import IUserService
from ...models.user import User
from ...resources.user_dto import UserDTO
from ...resources.asp_distance_dto import ASPDistanceDTO
from ...utilities.location_to_coordinates import getGeocodeFromAddress


class UserService(IUserService):
    """
    UserService implementation with user management methods
    """

    def __init__(self, logger, onsite_contact_service: IOnsiteContactService):
        """
        Create an instance of UserService

        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger
        self.onsite_contact_service = onsite_contact_service
        User.ensure_indexes()

    def get_user_by_id(self, user_id):
        try:
            user = User.objects(id=user_id).first()

            if not user:
                error_message = f"user_id {user_id} not found"
                self.logger.error(error_message)
                raise Exception(error_message)

            user_dict = UserService.__user_to_serializable_dict_and_remove_auth_id(user)
            kwargs = {
                "id": user_dict["id"],
                "info": user_dict["info"],
            }

            return UserDTO(**kwargs)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_user_by_auth_id(self, auth_id):
        """
        Get a User document by auth_id

        :param auth_id: the user's auth_id (Firebase uid)
        :type auth_id: str
        """
        user = User.objects(auth_id=auth_id).first()

        if not user:
            error_message = f"user with auth_id {auth_id} not found"
            self.logger.error(error_message)
            raise Exception(error_message)

        return user

    def get_user_by_email(self, email):
        try:
            firebase_user = firebase_admin.auth.get_user_by_email(email)
            user = User.objects(auth_id=firebase_user.uid).first()

            if not user:
                error_message = f"user with auth_id {firebase_user.uid} not found"
                self.logger.error(error_message)
                raise Exception(error_message)

            user_dict = UserService.__user_to_serializable_dict_and_remove_auth_id(user)
            kwargs = {
                "id": user_dict["id"],
                "info": user_dict["info"],
            }

            return UserDTO(**kwargs)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_user_role_by_auth_id(self, auth_id):
        try:
            user = self.get_user_by_auth_id(auth_id)
            return user.info.role
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user role. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_user_id_by_auth_id(self, auth_id):
        try:
            user = self.get_user_by_auth_id(auth_id)
            return str(user.id)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user id. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_auth_id_by_user_id(self, user_id):
        try:
            user = User.objects(id=user_id).first()

            if not user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            return user.auth_id
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get auth_id. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_users(self, offset, limit, role):
        user_dtos = []
        filteredUsers = User.objects()
        if role:
            filteredUsers = filteredUsers.filter(info__role=role)

        for user in filteredUsers.skip(offset).limit(limit):
            user_dtos.append(
                UserService.__user_to_serializable_dict_and_remove_auth_id(user)
            )
        return user_dtos

    def update_user_coordinates(self, user_dto):
        try:
            organization_coordinates = getGeocodeFromAddress(
                user_dto.info.organization_address
            )
            user_dto.info["organization_coordinates"] = organization_coordinates
            return user_dto
        except Exception as e:
            raise e

    def create_user(self, create_user_dto):
        new_user = None
        firebase_user = None

        try:
            firebase_user = firebase_admin.auth.create_user(
                email=create_user_dto.email, password=create_user_dto.password
            )

            try:
                user_info: UserInfo = (
                    OnboardingRequest.objects(id=create_user_dto.request_id)
                    .first()
                    .info
                )
                new_user: User = User(
                    auth_id=firebase_user.uid,
                    info=user_info,
                )
                new_user.save()
                for onsite_contact in user_info.initial_onsite_contacts:
                    self.onsite_contact_service.create_onsite_contact(
                        organization_id=new_user.id,
                        name=onsite_contact.name,
                        email=onsite_contact.email,
                        phone=onsite_contact.phone,
                    )

            except Exception as mongo_error:
                # rollback user creation in Firebase
                try:
                    firebase_admin.auth.delete_user(firebase_user.uid)
                except Exception as firebase_error:
                    reason = getattr(firebase_error, "message", None)
                    error_message = [
                        "Failed to rollback Firebase user creation after MongoDB",
                        "user creation failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(firebase_error))
                        ),
                        "Orphaned auth_id (Firebase uid) = {auth_id}".format(
                            auth_id=firebase_user.uid
                        ),
                    ]
                    self.logger.error(" ".join(error_message))

                raise mongo_error
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to create user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

        new_user_dict = UserService.__user_to_serializable_dict_and_remove_auth_id(
            new_user
        )
        kwargs = {
            "id": new_user_dict["id"],
            "info": new_user_dict["info"],
        }
        return UserDTO(**kwargs)

    def update_user_by_id(self, user_id, update_user_dto):
        try:
            update_user_dto = self.update_user_coordinates(update_user_dto)
            old_user = User.objects(id=user_id).modify(
                new=False,
                auth_id=update_user_dto.auth_id,
                info=update_user_dto.info,
            )

            if not old_user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            try:
                firebase_admin.auth.update_user(
                    old_user.auth_id, email=update_user_dto.info.email
                )
            except Exception as firebase_error:
                try:
                    # rollback MongoDB user update
                    User.objects(id=user_id).modify(
                        auth_id=old_user.auth_id,
                        info=old_user.info,
                    )
                except Exception as mongo_error:
                    reason = getattr(mongo_error, "message", None)
                    error_message = [
                        "Failed to rollback MongoDB user update after Firebase",
                        "user update failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(mongo_error))
                        ),
                        "MongoDB user id with possibly inconsistent",
                        "data = {user_id}".format(user_id=user_id),
                    ]
                    self.logger.error(" ".join(error_message))

                raise firebase_error
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to update user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

        updated_user = User.objects(id=user_id).first()
        if not updated_user:
            error_message = f"updated user_id {user_id} not found"
            self.logger.error(error_message)
            raise Exception(error_message)

        updated_user_dict = UserService.__user_to_serializable_dict_and_remove_auth_id(
            updated_user
        )
        kwargs = {
            "id": updated_user_dict["id"],
            "info": updated_user_dict["info"],
        }
        return UserDTO(**kwargs)

    def activate_user_by_id(self, user_id):
        try:
            user = User.objects(id=user_id).first()
            if not user:
                raise Exception(f"user_id {user_id} not found")

            user.info.active = True  # activate user

            user.save()  # save changes

            updated_user_dict = (
                UserService.__user_to_serializable_dict_and_remove_auth_id(user)
            )
            kwargs = {"id": updated_user_dict["id"], "info": updated_user_dict["info"]}

            return UserDTO(**kwargs)

        except Exception as e:
            self.logger.error(f"Failed to activate user. Reason = {e}")
            raise e

    def deactivate_user_by_id(self, user_id):
        try:
            user = User.objects(id=user_id).first()
            if not user:
                raise Exception(f"user_id {user_id} not found")

            user.info.active = False  # deactivate user

            user.save()  # save changes

            updated_user_dict = (
                UserService.__user_to_serializable_dict_and_remove_auth_id(user)
            )
            kwargs = {"id": updated_user_dict["id"], "info": updated_user_dict["info"]}

            return UserDTO(**kwargs)

        except Exception as e:
            self.logger.error(f"Failed to deactivate user. Reason = {e}")
            raise e

    def delete_user_by_id(self, user_id):
        try:
            deleted_user = User.objects(id=user_id).modify(remove=True, new=False)

            if not deleted_user:
                raise Exception(
                    "user_id {user_id} not found".format(user_id=user_id),
                )

            try:
                firebase_admin.auth.delete_user(deleted_user.auth_id)
            except Exception as firebase_error:
                # rollback MongoDB user deletion
                try:
                    User(
                        auth_id=deleted_user.auth_id,
                        info=deleted_user.info,
                    ).save()
                except Exception as mongo_error:
                    reason = getattr(mongo_error, "message", None)
                    error_message = [
                        "Failed to rollback MongoDB user deletion after",
                        "Firebase user deletion failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(mongo_error))
                        ),
                        "Firebase uid with non-existent MongoDB",
                        "record = {auth_id}".format(auth_id=deleted_user.auth_id),
                    ]
                    self.logger.error(" ".join(error_message))

                raise firebase_error
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to delete user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

        deleted_user_dict = UserService.__user_to_serializable_dict_and_remove_auth_id(
            deleted_user
        )
        kwargs = {
            "id": deleted_user_dict["id"],
            "info": deleted_user_dict["info"],
        }
        return UserDTO(**kwargs)

    def delete_user_by_email(self, email):
        try:
            firebase_user = firebase_admin.auth.get_user_by_email(email)
            deleted_user = User.objects(auth_id=firebase_user.uid).modify(
                remove=True, new=False
            )

            if not deleted_user:
                raise Exception(
                    "auth_id (Firebase uid) {auth_id} not found".format(
                        auth_id=firebase_user.uid
                    )
                )

            try:
                firebase_admin.auth.delete_user(firebase_user.uid)
            except Exception as firebase_error:
                try:
                    User(
                        auth_id=deleted_user.auth_id,
                        info=deleted_user.info,
                    ).save()
                except Exception as mongo_error:
                    reason = getattr(mongo_error, "message", None)
                    error_message = [
                        "Failed to rollback MongoDB user deletion after Firebase",
                        "user deletion failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(mongo_error))
                        ),
                        "Firebase uid with non-existent MongoDB",
                        "record = {auth_id}".format(auth_id=deleted_user.auth_id),
                    ]
                    self.logger.error(" ".join(error_message))

                raise firebase_error
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to delete user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

        deleted_user_dict = UserService.__user_to_serializable_dict_and_remove_auth_id(
            deleted_user
        )
        kwargs = {
            "id": deleted_user_dict["id"],
            "info": deleted_user_dict["info"],
        }
        return UserDTO(**kwargs)

    def get_asp_near_location(self, requestor_id, max_distance, limit, offset):
        try:
            requestor = self.get_user_by_id(requestor_id)
            if not requestor:
                raise Exception(f"user_id {requestor_id} not found")

            # Note: distance is in radians, so we multiply by 6371 to convert to KM
            pipeline = [
                {
                    "$geoNear": {
                        "near": requestor.info["organization_coordinates"],
                        "distanceField": "distance",
                        "maxDistance": max_distance / 6371,
                        "spherical": True,
                        "distanceMultiplier": 6371,
                    },
                },
                {"$match": {"info.role": "ASP"}},
                {"$skip": offset},
                {"$limit": limit},
            ]

            asp_distances = list(User.objects().aggregate(pipeline))

            asp_distance_dtos = []
            for asp_distance in asp_distances:
                try:
                    kwargs = {
                        "id": str(asp_distance["_id"]),
                        "info": asp_distance["info"],
                        "distance": round(Decimal(asp_distance["distance"]), 2),
                    }
                    asp_distance_dtos.append(ASPDistanceDTO(**kwargs))
                except Exception as e:
                    reason = getattr(e, "message", None)
                    self.logger.error(
                        "Failed to get ASPs. Reason = {reason}".format(
                            reason=(reason if reason else str(e))
                        )
                    )
                    raise e

            return asp_distance_dtos

        except Exception as e:
            self.logger.error(f"Failed to retrieve ASPs. Reason = {e}")
            raise e

    @staticmethod
    def __user_to_serializable_dict_and_remove_auth_id(user):
        """
        Convert a User document to a serializable dict and remove the
        auth id field

        :param user: the user
        :type user: User
        """
        user_dict = user.to_serializable_dict()
        user_dict.pop("auth_id", None)
        return user_dict
