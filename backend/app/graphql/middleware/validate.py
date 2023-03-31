from flask import jsonify, request
from functools import wraps
import json

from ...resources.create_user_dto import CreateUserDTO
from ...resources.entity_dto import EntityDTO
from ...resources.simple_entity_dto import SimpleEntityDTO
from ...resources.register_user_dto import RegisterUserDTO
from ...resources.update_user_dto import UpdateUserDTO

dtos = {
    "CreateUserDTO": CreateUserDTO,
    "EntityDTO": EntityDTO,
    "SimpleEntityDTO": SimpleEntityDTO,
    "RegisterUserDTO": RegisterUserDTO,
    "UpdateUserDTO": UpdateUserDTO,
}


def validate_request(dto_class_name):
    """
    Determine if request is valid based on the types of the arguments passed in
    to create or update a dto

    :param dto_class_name: the class name to create or update dto
    :type dto_class_name: str
    """

    def validate_dto(api_func):
        @wraps(api_func)
        def wrapper(*args, **kwargs):
            if (
                request.content_type
                and len(request.content_type.split(";")) > 0
                and request.content_type.split(";")[0] == "application/json"
            ):
                # Requests with a JSON body must explicitly specify
                # application/json as the Content-Type header.
                # Axios will do this automatically.
                dto = dtos[dto_class_name](**request.json)
            else:
                req_body = request.form.get("body", default=None)
                if req_body is None:
                    return jsonify({"error": "Missing body"}), 400
                req = json.loads(req_body)
                req["file"] = request.files.get("file", default=None)
                dto = dtos[dto_class_name](**req)
            error_message = dto.validate()
            if error_message:
                return (
                    jsonify({"error": error_message}),
                    400,
                )
            return api_func(*args, **kwargs)

        return wrapper

    return validate_dto


def validate_contact(contact, contact_str, error_list):
    if not isinstance(contact, dict):
        error_list.append(f"The {contact_str} supplied is not a dict.")
        return error_list
    contact_fields = ["name", "email", "phone"]
    for field in contact_fields:
        if field not in contact:
            error_list.append(
                f'The {contact_str} supplied does not have field "{field}".'
            )
        elif type(contact[field]) is not str:
            error_list.append(f'The field "{field}" in {contact_str} is not a string.')
        elif contact[field] == "":
            error_list.append(
                f'The field "{field}" in {contact_str} must not be an empty string.'
            )
    return error_list


def validate_userinfo(userinfo, error_list):
    userinfo_fields = [
        "email",
        "organization_address",
        "organization_name",
        "role",
        "primary_contact",
        "onsite_contacts",
    ]
    if not isinstance(userinfo, dict):
        error_list.append("The info supplied is not a dict.")
        return error_list

    for field in userinfo_fields:
        if field not in userinfo:
            error_list.append(f'The info supplied does not have field "{field}".')
    for key, val in userinfo.items():
        if key == "primary_contact":
            error_list = validate_contact(val, "info.primary_contact", error_list)
        elif key == "onsite_contacts":
            if not isinstance(val, list):
                error_list.append("The info.onsite_contacts supplied is not a list.")
            else:
                for i in range(len(val)):
                    error_list = validate_contact(
                        val[i], f"index {i} of info.onsite_contacts", error_list
                    )
        elif type(val) is not str:
            error_list.append(f"The field info.{key} supplied is not a string.")
        elif val == "":
            error_list.append(
                f"The field info.{key} supplied must not be an empty string."
            )
    return error_list
