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
            if field not in role_info:
                error_list.append(
                    f'The {role_info_str} supplied does not have field "{field}".'
                )
            elif type(role_info[field]) is not int:
                error_list.append(
                    f'The field "{field}" in {role_info_str} is not a string.'
                )

    # TODO: Add doner info validation once meal doner schema is finalized
    return error_list


def validate_userinfo(userinfo, error_list):
    userinfo_fields = [
        "email",
        "organization_address",
        "organization_name",
        "organization_desc",
        "role",
        "role_info",
        "primary_contact",
        "onsite_contacts",
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
        elif type(val) is not str:
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
