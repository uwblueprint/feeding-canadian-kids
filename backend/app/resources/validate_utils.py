from ..models.user_info import (
    USERINFO_ROLES,
    USERINFO_ROLE_ASP,
    USERINFO_ROLE_ADMIN,
)


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


def validate_role_info(role, role_info, role_info_str, error_list):
    if not isinstance(role_info, dict) and role != USERINFO_ROLE_ADMIN:
        error_list.append(f"The {role_info_str} supplied is not a dict.")
        return error_list

    asp_info_fields = ["num_kids"]
    if role == USERINFO_ROLE_ASP:
        for field in asp_info_fields:
            role_info = role_info["asp_info"]
            print(f"validating role_info {role_info} for field {field}")
            if field not in role_info:
                error_list.append(
                    f'The {role_info_str} supplied does not have field "{field}".'
                )
            elif type(role_info[field]) is not int:
                error_list.append(
                    f'The field "{field}" in {role_info_str} is not a string.'
                )
            elif field == "num_kids" and role_info["num_kids"] < 0:
                error_list.append("num_kids must be greater than or equal to zero.")
    # TODO: Add donor info validation once meal donor schema is finalized
    return error_list

def validate_coordinates(coordinates, error_list):
    if not isinstance(coordinates, list):
        error_list.append("The info.organization_coordinates supplied is not a list.")
    elif len(coordinates) != 2:
        error_list.append("The info.organization_coordinates supplied does not contain 2 elements.")
    elif not isinstance(coordinates[0], float) and not isinstance(coordinates[1], float):
        error_list.append("The info.organization_coordinates supplied does not contain a list of floats.")
    elif -180 <= coordinates[0] <= 180 or -180 <= coordinates[1]<= 180:
        error_list.append("The info.organization_coordinates supplied are not in the interval [-180, 180].")
    return error_list

def validate_userinfo(userinfo, error_list):
    userinfo_fields = [
        "email",
        "organization_address",
        "organization_name",
        "organization_desc",
        "organization_coordinates",
        "role",
        "role_info",
        "primary_contact",
        "onsite_contacts",
        "active",
    ]
    if not isinstance(userinfo, dict):
        error_list.append("The info supplied is not a dict.")
        return error_list

    for field in userinfo_fields:
        if field not in userinfo and (
            field != "role_info" or userinfo["role"] != USERINFO_ROLE_ADMIN
        ):
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
        elif key == "role_info":
            error_list = validate_role_info(
                userinfo["role"], val, "info.role_info", error_list
            )
        elif key == "active" and type(val) is not bool:
            error_list.append("The field info.active supplied is not a boolean.")
        elif key == "organization_coordinates":
            error_list = validate_coordinates(val, error_list)
        elif type(val) is not str and key != "active":
            error_list.append(f"The field info.{key} supplied is not a string.")
        elif val == "":
            error_list.append(
                f"The field info.{key} supplied must not be an empty string."
            )
        elif key == "role" and val not in USERINFO_ROLES:
            error_list.append(
                "The status is not one of {valid_roles}".format(
                    valid_roles=", ".join(USERINFO_ROLES)
                )
            )

    return error_list
